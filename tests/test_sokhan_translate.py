import importlib.util
import unittest
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "scripts" / "sokhan_translate.py"
SPEC = importlib.util.spec_from_file_location("sokhan_translate", MODULE_PATH)
SOKHAN = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(SOKHAN)


class SokhanTranslationTests(unittest.TestCase):
    def test_accepts_loopback_ollama_endpoint(self):
        self.assertEqual(
            SOKHAN.local_endpoint("http://127.0.0.1:11434"),
            "http://127.0.0.1:11434/api/generate",
        )

    def test_rejects_remote_translation_endpoint(self):
        with self.assertRaisesRegex(ValueError, "localhost"):
            SOKHAN.local_endpoint("https://example.com")

    def test_rejects_endpoint_path_and_credentials(self):
        with self.assertRaises(ValueError):
            SOKHAN.local_endpoint("http://localhost:11434/other")
        with self.assertRaises(ValueError):
            SOKHAN.local_endpoint("http://user:secret@localhost:11434")

    def test_splits_paragraphs_without_losing_source_text(self):
        source = "First sentence.\n\nSecond sentence."
        self.assertEqual(
            SOKHAN.split_segments(source),
            ["First sentence.", "Second sentence."],
        )

    def test_rejects_empty_source(self):
        with self.assertRaisesRegex(ValueError, "no translatable text"):
            SOKHAN.split_segments(" \n\n ")

    def test_preserves_storyboard_scene_ids(self):
        storyboard = {
            "scenes": [
                {"id": "scene-01", "narration": "English narration one."},
                {"id": "scene-02", "narration": "English narration two."},
                {"id": "scene-03", "narration": ""}
            ]
        }
        segments = SOKHAN.extract_source_segments(
            __import__("json").dumps(storyboard), ".json"
        )
        self.assertEqual([item[0] for item in segments], ["scene-01", "scene-02"])
        self.assertEqual(segments[0][1], "English narration one.")

    def test_rejects_duplicate_storyboard_scene_ids(self):
        storyboard = '{"scenes":[{"id":"same","narration":"One."},{"id":"same","narration":"Two."}]}'
        with self.assertRaisesRegex(ValueError, "duplicate id"):
            SOKHAN.extract_source_segments(storyboard, ".json")


if __name__ == "__main__":
    unittest.main()
