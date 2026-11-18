"""Print a draft mapping patch, without changing any live experiment tables.

These are proposed syllables, not validated experimental stimuli. Orthographic
similarity and lexicality require review. Phonological candidates retain the
target's initial/vowel and use a different orthographic t-class coda.
Reference: https://www.korean.go.kr/kornorms/m/m_regltn.do?regltn_code=0002
"""
import csv
import io
from collections import Counter
from build_conditions import ROOT, RELATIONS, source_groups, build, patch_for

CODAS = list("_ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ")
ORTHO_CODAS = {"ㄱ": "ㅋ", "ㅋ": "ㄱ", "ㅂ": "ㅍ", "ㅍ": "ㅂ", "ㄹ": "ㅁ", "ㅁ": "ㅂ", "ㅇ": "ㅁ"}

def parts(syllable):
    value = ord(syllable) - 0xAC00
    return value // 588, value % 588 // 28, CODAS[value % 28]

def with_coda(syllable, coda):
    return chr(ord(syllable) - (ord(syllable) - 0xAC00) % 28 + CODAS.index(coda))

def candidates():
    pairs = sorted({(g[1]["status"], g[0]["syllable"], g[1]["syllable"])
                    for g in source_groups("main") if len(g) == 3})
    unrelated = sorted({first for status, target, first in pairs if status == "unrelated"})
    result = []
    for status, target, first in pairs:
        if status == "phono":
            second = next(with_coda(target, c) for c in "ㄷㅅㅈㅊㅌㅆ" if with_coda(target, c) not in (target, first))
            basis = "타겟 초성·중성 유지; 다른 ㄷ계열 종성 표기 후보"
        elif status == "ortho":
            second = with_coda(first, ORTHO_CODAS[parts(first)[2]])
            basis = "첫 유사 자극의 초성·중성 유지; 종성 변경 후보; 시각 유사도 미검증"
        else:
            ti, tv, tc = parts(target)
            second = next(s for s in unrelated if s not in (target, first) and
                          all(a != b for a, b in zip(parts(s), (ti, tv, tc))))
            basis = "기존 무관련 풀 중 타겟과 초성·중성·종성이 모두 다른 후보"
        assert len({target, first, second}) == 3
        result.append({"condition": status, "target": target, "first": first,
                       "second_candidate": second, "review_status": "검토 필요",
                       "basis": basis})
    return result

def check_sequence(mapping):
    lookup = {(r["condition"], r["target"], r["first"]): r["second_candidate"] for r in mapping}
    for block in ("practice", "main"):
        rows = build(3, block)
        for i, row in enumerate(rows):
            if row["position"] == "third":
                row["stimulus"] = lookup[row["status"], rows[i - 2]["stimulus"], rows[i - 1]["stimulus"]]
                assert row["stimulus"] not in (rows[i - 1]["stimulus"], rows[i - 2]["stimulus"])
        for i, row in enumerate(rows):
            match = row["isDummy"] != "1" and i >= 3 and row["stimulus"] == rows[i - 3]["stimulus"]
            assert match == (row["isTarget"] == "1"), f"Unexpected match: {block} {i + 1}"
        assert Counter(r["relationType"] for r in rows if r["isTarget"] == "1") == dict.fromkeys(RELATIONS.values(), 15 if block == "main" else 1)

def main():
    rows = candidates()
    check_sequence(rows)
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=list(rows[0]), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    patch = patch_for(ROOT / "review/3back-second-stimulus-candidates.csv", output.getvalue())
    if patch:
        print("\n".join(["*** Begin Patch", *patch, "*** End Patch"]))

if __name__ == "__main__":
    main()
