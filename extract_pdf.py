import PyPDF2
import sys

def extract_pdf_text(pdf_path, output_path):
    reader = PyPDF2.PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(text)
    
    print(f"Texte extraite de {pdf_path} vers {output_path}")

if __name__ == "__main__":
    pdf_path = "Cahier_des_modifications_application_pieces.pdf"
    output_path = "Cahier_des_modifications_application_pieces.txt"
    extract_pdf_text(pdf_path, output_path)