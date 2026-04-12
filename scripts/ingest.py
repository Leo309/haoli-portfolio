"""
Ingestion script for haoli.ai AI Resume Agent.

Reads Markdown files from /data/, splits them into chunks by ## headers,
embeds each chunk via OpenAI text-embedding-3-small, and upserts into
Supabase pgvector. Re-run whenever you update /data/ files.

Usage:
    pip install openai supabase
    python scripts/ingest.py
"""

import os
from pathlib import Path
from openai import OpenAI
from supabase import create_client

openai_client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_ROLE_KEY"])


def chunk_text(text: str, chunk_size: int = 400, overlap: int = 50) -> list[str]:
    """Split text into overlapping chunks by word count."""
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = " ".join(words[i : i + chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
    return chunks


def embed(text: str) -> list[float]:
    """Get embedding vector for a text string."""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
    )
    return response.data[0].embedding


def ingest_file(filepath: str, source_name: str):
    """Read a markdown file, chunk it, embed chunks, store in Supabase."""
    content = Path(filepath).read_text(encoding="utf-8")

    # Split by ## headers to preserve section boundaries
    sections = content.split("\n## ")

    for section in sections:
        lines = section.strip().split("\n")
        section_title = lines[0].replace("# ", "").strip() if lines else source_name
        section_content = "\n".join(lines[1:]).strip() if len(lines) > 1 else section.strip()

        if not section_content:
            continue

        chunks = chunk_text(section_content)

        for i, chunk in enumerate(chunks):
            doc_id = f"{source_name}_{section_title[:20].lower().replace(' ', '_')}_{i:03d}"
            embedding = embed(chunk)

            supabase.table("documents").upsert(
                {
                    "id": doc_id,
                    "source": source_name,
                    "section": section_title,
                    "content": chunk,
                    "embedding": embedding,
                }
            ).execute()

            print(f"  Ingested: {doc_id} ({len(chunk.split())} words)")


def clear_all():
    """Clear all existing documents before re-ingestion."""
    supabase.table("documents").delete().neq("id", "").execute()
    print("Cleared all existing documents.")


if __name__ == "__main__":
    clear_all()

    files = [
        ("data/resume.md", "resume"),
        ("data/projects.md", "projects"),
        ("data/skills.md", "skills"),
        ("data/experience.md", "experience"),
        ("data/education.md", "education"),
        ("data/about.md", "about"),
    ]

    for filepath, source_name in files:
        if Path(filepath).exists():
            print(f"\nIngesting {filepath}...")
            ingest_file(filepath, source_name)
        else:
            print(f"\nSkipping {filepath} (not found)")

    print("\nDone! All documents ingested.")
