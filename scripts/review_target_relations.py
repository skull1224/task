"""Write a review-only proposal; never modify executable condition tables.

The user's ㅈ -> ㅊ/ㅅ example anchors these provisional shape families.
They are editorial candidates, not measured visual similarity scores.
Empty proposed cells mean unresolved, not an empty experimental stimulus.
"""
import csv
import json
from collections import Counter

from build_conditions import ROOT, build
from preview_distinct_relations import parts, with_coda

SHAPE_CANDIDATES = {"ㅈ": "ㅊㅅ", "ㅊ": "ㅈㅅ", "ㅅ": "ㅈㅊ", "ㅆ": "ㅅㅈ"}
SOURCE = ROOT / "review/3back-second-stimulus-candidates.csv"
DEST = ROOT / "review/3back-target-review-20261117.csv"


def main():
    with SOURCE.open(encoding="utf-8-sig", newline="") as handle:
        old = list(csv.DictReader(handle))
    reviewed = []
    proposals = {}
    for row in old:
        condition, target = row["condition"], row["target"]
        coda = parts(target)[2]
        first = second = ""
        if condition == "ortho" and coda in SHAPE_CANDIDATES:
            first, second = (with_coda(target, c) for c in SHAPE_CANDIDATES[coda])
            status = "수정 후보·미적용"
            note = "목표 기준 받침 형태 후보; 시각 유사도 실측 전; 단독 음절 받침 대표음 동일로 음운 조건과 중첩"
            if coda == "ㅆ":
                note += "; ㅆ-ㅈ 유사성은 추가 검토 필요"
            proposals[condition, target, row["first"]] = (first, second)
        elif condition == "ortho":
            status = "보류"
            note = "목표 받침에 대한 두 시각 유사 후보 미확정; 자동 받침 치환 중단"
        elif condition == "phono":
            status = "조건 구분 재검토"
            note = "철자 후보에도 동일 받침 대표음이 포함되어 조건 간 음운 중첩; 시각 유사도 대비 필요"
            if "ㅎ" in (coda, parts(row["first"])[2], parts(row["second_candidate"])[2]):
                note += "; ㅎ 포함 비단어의 단독 읽기 확인 필요"
        else:
            status = "재배정 필요"
            note = "기존 후보 배정 편중; 두 자극 각각의 목표와의 관계 및 제시 빈도 재검토"
        if first:
            assert len({target, first, second}) == 3
            assert parts(target)[:2] == parts(first)[:2] == parts(second)[:2]
        reviewed.append({
            "condition": condition, "target": target, "target_coda": coda,
            "previous_first": row["first"], "previous_second_candidate": row["second_candidate"],
            "proposed_first": first, "proposed_second": second,
            "status": status, "review_note": note,
        })

    sequence_checks = {}
    for block in ("practice", "main"):
        rows = build(3, block)
        changed = 0
        for i, row in enumerate(rows):
            if row["position"] != "first":
                continue
            key = (rows[i + 1]["status"], row["stimulus"], rows[i + 1]["stimulus"])
            if key in proposals:
                rows[i + 1]["stimulus"], rows[i + 2]["stimulus"] = proposals[key]
                changed += 1
        mismatches = []
        for i, row in enumerate(rows):
            actual = row["isDummy"] != "1" and i >= 3 and row["stimulus"] == rows[i - 3]["stimulus"]
            if actual != (row["isTarget"] == "1"):
                mismatches.append(i + 1)
        sequence_checks[block] = {
            "scope": "partial proposal only; unresolved items retain current live stimuli",
            "trials": len(rows), "changed_groups": changed,
            "expected_response_trials": sum(r["isTarget"] == "1" for r in rows),
            "answer_mismatch_trials": mismatches,
        }

    summary = {
        "reviewed_mappings": len(reviewed),
        "status_counts": dict(Counter(r["status"] for r in reviewed)),
        "old_unrelated_second_candidate_counts": dict(Counter(r["second_candidate"] for r in old if r["condition"] == "unrelated")),
        "initial_vowel_mismatches_in_old_related_candidates": sum(
            parts(r["target"])[:2] != parts(r[field])[:2]
            for r in old if r["condition"] != "unrelated"
            for field in ("first", "second_candidate")
        ),
        "partial_sequence_checks": sequence_checks,
        "live_tables_modified": False,
        "visual_similarity_measured": False,
        "lexicality_screened": False,
        "pronunciation_reference": "https://korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002",
    }
    with DEST.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(reviewed[0]))
        writer.writeheader()
        writer.writerows(reviewed)
    DEST.with_suffix(".json").write_text(json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    for row in reviewed:
        if row["condition"] == "ortho":
            print(row["target"], row["proposed_first"], row["proposed_second"], row["status"])


if __name__ == "__main__":
    main()
