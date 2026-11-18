"""Validate or print a patch for tables derived from the user's exact list.

2-back preserves main-source.tsv verbatim. 3-back duplicates the paired
relation stimulus once. No independent stimulus pools or random replacements.
"""
import argparse
from collections import Counter
import csv
import difflib
import io
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "2back/conditions/main-source.tsv"
RELATIONS = {"ortho": "orthographic", "phono": "phonological", "unrelated": "unrelated"}
LABELS = {"orthographic": "철자 유사", "phonological": "음운 유사", "unrelated": "무관련"}
CODES = {"orthographic": ("O_respond", "1"), "phonological": ("P_respond", "2"), "unrelated": ("U_respond", "3")}
FIELDS = "blockType blockLabel blockOrderIndex trialNumber scoredTrialIndex relationType relationLabel stimulus stimulusRole combination position isDummy isTarget expectedResponse coranswer condition Attribute1 status nLevel breakAfter".split()

def source_groups(block):
    with SOURCE.open(encoding="utf-8-sig", newline="") as handle:
        source = list(csv.DictReader(handle, delimiter="\t"))
    assert len(source) == 414
    assert Counter(row["status"] for row in source) == {"dummy": 9, "target": 180, "ortho": 51, "phono": 42, "unrelated": 42, "first_fill": 43, "second_fill": 47}
    groups, index = [], 0
    while index < len(source):
        if source[index]["status"] == "dummy":
            groups.append(source[index:index + 1])
            index += 1
            continue
        group = source[index:index + 3]
        assert len(group) == 3 and group[0]["status"] == "target"
        assert group[1]["status"] in RELATIONS
        assert group[2]["status"] in ("target", "first_fill", "second_fill")
        assert (group[0]["syllable"] == group[2]["syllable"]) == (group[2]["status"] == "target")
        assert group[0]["syllable"] != group[1]["syllable"]
        groups.append(group)
        index += 3
    assert sum(len(group) == 3 for group in groups) == 135
    if block == "main":
        return groups
    # First matching and nonmatching example per condition, in source order.
    practice, seen = groups[:3], set()
    for group in groups:
        if len(group) == 1:
            continue
        key = group[1]["status"], group[2]["status"] == "target"
        if key not in seen:
            practice.append(group)
            seen.add(key)
    assert len(seen) == 6
    return practice

def build(lag, block):
    groups, rows = source_groups(block), []
    combination = scored = 0
    for group_index, group in enumerate(groups):
        dummy = len(group) == 1
        if dummy:
            expanded, relation = group, "dummy"
        else:
            combination += 1
            expanded = [group[0]] + [group[1]] * (lag - 1) + [group[2]]
            relation = RELATIONS[group[1]["status"]]
        for position, item in enumerate(expanded):
            if not dummy:
                scored += 1
            target = not dummy and position == lag and item["status"] == "target"
            role = ("dummy" if dummy else "target_anchor" if position == 0 else
                    "relation_stimulus" if position < lag else "target" if target else item["status"])
            condition, attribute = CODES[relation] if target else ("", "9" if dummy else "8")
            values = [block, "연습 블록" if block == "practice" else "본실험",
                      1 if block == "practice" else 2, len(rows) + 1,
                      "" if dummy else scored, relation, "더미" if dummy else LABELS[relation],
                      item["syllable"], role, "" if dummy else combination,
                      "" if dummy else ("first", "second", "third", "fourth")[position],
                      int(dummy), int(target), int(target), "space" if target else "",
                      condition, attribute, item["status"], lag, 0]
            rows.append(dict(zip(FIELDS, map(str, values))))
        # Keep the existing 3-back break screen at the two section boundaries.
        if lag == 3 and block == "main" and not dummy and group_index + 1 < len(groups) and len(groups[group_index + 1]) == 1:
            rows[-1]["breakAfter"] = "1"
    return rows

def validate(rows, lag, block):
    assert len(rows) == {(2, "main"): 414, (3, "main"): 549, (2, "practice"): 21, (3, "practice"): 27}[lag, block]
    assert sum(row["isDummy"] == "1" for row in rows) == (9 if block == "main" else 3)
    assert Counter(row["relationType"] for row in rows if row["isTarget"] == "1") == dict.fromkeys(LABELS, 15 if block == "main" else 1)
    scored = 0
    for index, row in enumerate(rows):
        dummy, target = row["isDummy"] == "1", row["isTarget"] == "1"
        match = not dummy and index >= lag and row["stimulus"] == rows[index - lag]["stimulus"]
        assert target == match, f"Incorrect answer at trial {index + 1}"
        assert row["expectedResponse"] == str(int(match))
        assert row["coranswer"] == ("space" if match else "")
        assert int(row["trialNumber"]) == index + 1
        scored += int(not dummy)
        assert row["scoredTrialIndex"] == ("" if dummy else str(scored))
        if target:
            window = rows[index - lag:index + 1]
            assert all(part["relationType"] == row["relationType"] for part in window)
            assert all(part["combination"] == row["combination"] for part in window)
            assert all(part["stimulusRole"] == "relation_stimulus" for part in window[1:-1])
            assert all(part["stimulus"] == window[1]["stimulus"] for part in window[1:-1])
    for index, (actual, expected) in enumerate(zip(rows, build(lag, block))):
        assert actual == expected, f"Source mismatch at trial {index + 1}"

def serialize(rows, simple=False):
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=["status", "syllable"] if simple else FIELDS,
                            delimiter="\t" if simple else ",", lineterminator="\n")
    writer.writeheader()
    writer.writerows(({"status": row["status"], "syllable": row["stimulus"]} for row in rows) if simple else rows)
    return output.getvalue()

def patch_for(path, new):
    if not path.exists():
        return [f"*** Add File: {path}", *["+" + line for line in new.splitlines()]]
    old = path.read_text(encoding="utf-8")
    if old.startswith("\ufeff"):
        new = "\ufeff" + new
    diff = list(difflib.unified_diff(old.splitlines(), new.splitlines(), n=2))[2:]
    return [f"*** Update File: {path}", *["@@" if line.startswith("@@") else line for line in diff]] if diff else []

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--patch", action="store_true")
    parser.add_argument("--lag", type=int, choices=(2, 3))
    parser.add_argument("--block", choices=("practice", "main"))
    args, patches = parser.parse_args(), []
    for lag in ([args.lag] if args.lag else (2, 3)):
        for block in ([args.block] if args.block else ("practice", "main")):
            folder = ROOT / f"{lag}back/conditions"
            path, simple_path = folder / f"{block}.csv", folder / f"{block}-source.tsv"
            if args.patch:
                rows = build(lag, block)
                validate(rows, lag, block)
                patches.extend(patch_for(path, serialize(rows)))
                if simple_path != SOURCE:
                    patches.extend(patch_for(simple_path, serialize(rows, simple=True)))
            else:
                with path.open(encoding="utf-8-sig", newline="") as handle:
                    rows = list(csv.DictReader(handle))
                validate(rows, lag, block)
                assert simple_path.read_text(encoding="utf-8-sig") == serialize(rows, simple=True)
                print(f"PASS {lag}-back {block}: {len(rows)} trials, {sum(row['isTarget'] == '1' for row in rows)} responses; source pairs/order and scoring verified")
    if patches:
        print("\n".join(["*** Begin Patch", *patches, "*** End Patch"]))

if __name__ == "__main__":
    main()
