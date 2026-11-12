import json
import unittest
from pathlib import Path

FIXTURE = Path(__file__).resolve().parents[1] / "evaluation" / "en-fa-cases.json"


class SokhanEvaluationFixtureTests(unittest.TestCase):
    def test_reference_set_covers_required_translation_risk_categories(self):
        cases = json.loads(FIXTURE.read_text(encoding="utf-8"))
        self.assertGreaterEqual(len(cases), 10)
        categories = {case["category"] for case in cases}
        self.assertTrue({
            "terminology",
            "numbers-units",
            "named-entities",
            "acronyms",
            "idiom",
            "uncertainty",
            "punctuation",
            "long-sentence",
            "mixed-script",
            "instruction-as-content",
        }.issubset(categories))

    def test_reference_translations_are_not_fabricated_or_claimed_human_reviewed(self):
        cases = json.loads(FIXTURE.read_text(encoding="utf-8"))
        for case in cases:
            with self.subTest(case=case["id"]):
                self.assertIsNone(case["referenceTranslation"])
                self.assertEqual(case["humanReviewStatus"], "not_reviewed")
                self.assertTrue(case["sourceText"].strip())
                self.assertTrue(case["expectedChecks"])


if __name__ == "__main__":
    unittest.main()
