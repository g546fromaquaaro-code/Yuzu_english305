# MISSION 20 PART 2

Entry: `hayamihyo.html?part=2&v=35`, linked from the existing MISSION 20 menu.

The source repository contains two distinct 30-lesson tracks. Both are included:

- 合格レッスン: the 90 central vocabulary items and 30 ordering-example sentences from `g5-bank.js`, in its six units.
- これまでのフレーズ: the phrase lists of Lessons 1–30, in six blocks of five lessons. This material includes more advanced expressions; it is not a list of exclusively required Grade 5 vocabulary.

The compiled bank contains 515 unique English expressions, including 82 already present in PART 1. Case, terminal punctuation, apostrophe style, and whitespace are normalized for deduplication. Multiple source lessons are retained on each entry. Incorrect distractors and incidental words inside questions are not treated as vocabulary entries.

Each block can be filtered to a source lesson and/or expressions absent from PART 1. The same filtered set drives the guide and the mission. A mission contains at most 20 expressions. Reduced retries retain distractors and never overwrite a full-round time. Learning the same expression in another block shares its PART 2 record.

PART 1 and PART 2 share the existing matching/review engine and BGM controls. PART 2 uses `eigo305-lesson-mission-mastered-v1`, `eigo305-lesson-mission-records-v1`, and the `lesson-mission` namespace in shared practice storage. It does not add expressions to the original word-shop mastery count. Records are not synchronized to the source app. Unfinished card placement is not saved; graded mistakes remain due for the next session.

Source attribution is included in the compiled bank and visible guide. Source files are never evaluated by the deployed browser. Rebuild with:

```
node scripts/build-lesson-mission.cjs ../Yuzu_crauti_bronze
```

Editorial fixes include the subject of “She is baking a cake”, “a sheep farmer”, the meaning of “try to stay up all night”, and clearer short-answer translations. Full sentences extracted from ordering exercises gain punctuation. The original source repository remains unchanged.

Validation: 28 automated tests passed, including source coverage, filtered pools, complete matching and retry flows, independent storage, and existing modules. Physical iPad Safari display/audio testing was not performed.
