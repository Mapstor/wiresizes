# NFPA committee-report reader: prints a page range of an NFPA PDF (First Draft, Second Draft, public input
# or public comment report) with the revision marks the plain text loses.
#   [+text]  underlined in the PDF: inserted by the revision or public input
#   [-text]  struck through in the PDF: deleted by it
#   unmarked text in a public input on "NFPA 70-2023" is the 2023 edition's own text
#
#   python3 -I scripts/research/nfpa-markup.py <file.pdf> <first page> <last page>
#
# Pages are PDF page numbers (1-based), not the report's printed "N of M" footer. Needs pdfplumber.
# Known limits: a 'g', 'j' or 'p' inside an underlined run can print outside the brackets (its descender
# crosses the line); table borders can print as [+...]; the "FOR COMMITTEE USE ONLY" watermark in
# First Draft reports prints as stray capital letters.
import sys, pdfplumber
pdf_path, first, last = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
def tag_of(c, segs):
    h = c['bottom'] - c['top']; mid = (c['top'] + c['bottom']) / 2; t = ''
    for x0, x1, y in segs:
        if x0 <= c['x1'] - 0.5 and x1 >= c['x0'] + 0.5:
            if abs(y - mid) < h * 0.3: return '-'
            if -1.5 <= y - c['bottom'] <= 3.5: t = '+'
    return t
with pdfplumber.open(pdf_path) as pdf:
    for pno in range(first - 1, last):
        page = pdf.pages[pno]
        segs = [(l['x0'], l['x1'], l['top']) for l in page.lines if abs(l['top'] - l['bottom']) < 1.5 and l['x1'] - l['x0'] < 450]
        segs += [(r['x0'], r['x1'], (r['top'] + r['bottom']) / 2) for r in page.rects if r['height'] < 1.6 and 1 < r['width'] < 450]
        chars = sorted(page.chars, key=lambda c: (round(c['top']), c['x0']))
        lines, cur = [], None
        for c in chars:
            if cur is None or abs(c['top'] - cur['top']) > 3:
                cur = {'top': c['top'], 'chars': []}; lines.append(cur)
            cur['chars'].append(c)
        print(f'--- pdf page {pno + 1}')
        for ln in lines:
            cs = sorted(ln['chars'], key=lambda c: c['x0'])
            out, state, prev = '', '', None
            for c in cs:
                t = tag_of(c, segs)
                gap = prev is not None and c['x0'] - prev['x1'] > c['size'] * 0.22
                if t != state:
                    if state: out += ']'
                    if gap: out += ' '; gap = False
                    if t: out += '[' + t
                    state = t
                if gap: out += ' '
                out += c['text']; prev = c
            if state: out += ']'
            if 'ContentFetcher' in out or out.startswith('National Fire') or out.endswith(' PM'): continue
            print(out)
