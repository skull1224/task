# 3-back 자극

2026-11-18 기준 현재 적용된 3-back 자극표입니다.

## 파일

- `3back/conditions/main.csv`: 본실험 자극·조건·순서·정답
- `3back/conditions/practice.csv`: 연습 자극·조건·순서·정답
- `3back/conditions/main-source.tsv`: 본실험 상태·음절 2열 목록
- `3back/conditions/practice-source.tsv`: 연습 상태·음절 2열 목록

## 구성

| 구분 | 전체 시행 | 더미 시행 | 반응 타겟 |
| --- | ---: | ---: | ---: |
| 본실험 | 549 | 9 | 45 (철자 유사·음운 유사·무관련 각 15) |
| 연습 | 27 | 3 | 3 (조건별 1) |

현재 적용본은 각 조합을 `A → 관계 자극 → 동일 관계 자극 → A/채움 자극`으로 구성합니다. 서로 다른 두 번째 관계 자극의 수정 후보는 아직 미적용 상태이므로 포함하지 않았습니다.

`status=target`은 최초 제시에도 사용됩니다. 실제 반응 여부는 `isTarget`, `expectedResponse`, `coranswer`를 기준으로 확인합니다. 더미는 채점에서 제외됩니다.

원본 프로젝트의 `scripts/check_conditions.py`로 원본 대응, 자극 쌍과 순서, 시행 수, 정답 및 의도하지 않은 3-back 일치 여부를 검증했습니다. 시각 유사도·어휘성 검증 여부와는 별개입니다.

## 원본 무결성

로컬 적용본을 변경 없이 복사했습니다. SHA-256:

```text
ea4f4b7339b6d1042c3c5a933d1ab64b133dc751900c10e50db429d62115343f  3back/conditions/main.csv
15a16133600bdd21547890531d15714537cd7c8125cd739b842cf2022dca319d  3back/conditions/main-source.tsv
6397899cdedd835350dc6065d6043c7a486a4e222254bbea4a59c9e8b774d473  3back/conditions/practice.csv
005cd32528796ef9cadd4cc5fa4fdb82888ab07a5c6dccedb42942d950c70ec4  3back/conditions/practice-source.tsv
```
