def download_pdf(url, file_name):
    import requests

    r = requests.get(url, stream=True)

    with open(file_name, "wb") as f:
        for chunk in r.iter_content(chunk_size=1024):
            if chunk:
                f.write(chunk)

    return file_name


def read_pdf(file) -> str:
    _data = ""

    pdfReader = PyPDF2.PdfReader(file)

    pages = len(pdfReader.pages)

    for i in range(pages):

        page = pdfReader.pages[i]

        t = page.extract_text()

        _data += t

    return _data
