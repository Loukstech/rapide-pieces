import os

with open('rapid_pieces_doc.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Write in chunks to avoid encoding issues
total = len(text)
chunk = 10000
for start in range(0, min(total, 35000), chunk):
    end = min(start + chunk, total)
    chunk_file = f'rapid_pieces_chunk_{start}.txt'
    with open(chunk_file, 'w', encoding='utf-8') as f:
        f.write(text[start:end])
    print(f'Wrote chunk {start}-{end}')
