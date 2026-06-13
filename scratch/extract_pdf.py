from pypdf import PdfReader

pdf_path = "/Users/riosisrelg/Downloads/Cancionero HS aniversario mayo 2026.pdf"
output_path = "scratch/pdf_text.txt"

try:
    reader = PdfReader(pdf_path)
    print(f"Total pages: {len(reader.pages)}")
    
    with open(output_path, "w", encoding="utf-8") as f:
        for i in range(len(reader.pages)):
            text = reader.pages[i].extract_text()
            f.write(f"\n================ PAGE {i+1} ================\n")
            if text:
                f.write(text)
            else:
                f.write("[No text found on this page]")
            f.write("\n")
            
    print(f"Text successfully written to {output_path}")
except Exception as e:
    print(f"Error: {e}")
