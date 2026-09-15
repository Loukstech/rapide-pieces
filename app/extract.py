import pymupdf
import os
import glob

# Find the PDF file
pdf_files = glob.glob(os.path.join(os.getcwd(), "*.pdf"))
if not pdf_files:
    # Try listing all files
    all_files = os.listdir(os.getcwd())
    print("All files:", all_files)
    pdf_files = [os.path.join(os.getcwd(), f) for f in all_files if f.lower().endswith('.pdf')]
    print("PDF files found:", pdf_files)

if pdf_files:
    pdf_path = pdf_files[0]
    print(f"Opening: {pdf_path}")
    doc = pymupdf.open(pdf_path)
    full_text = ''
    for i, page in enumerate(doc):
        text = page.get_text()
        full_text += f'\n--- PAGE {i+1} ---\n{text}'
    
    output_path = os.path.join(os.getcwd(), 'rapid_pieces_doc.txt')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(full_text)
    
    print(f'Total pages: {len(doc)}')
    print('=== TEXT CONTENT ===')
    print(full_text[:15000])
    print('=== END OF FIRST 15000 CHARS ===')
else:
    print("No PDF files found!")
