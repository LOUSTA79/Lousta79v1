import os
import glob
from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

app = FastAPI()
templates = Jinja2Templates(directory=os.path.expanduser("~/lousta/templates"))

@app.get("/dashboard", response_class=HTMLResponse)
async def read_dashboard(request: Request):
    # Live production metrics
    books = len(glob.glob(os.path.expanduser("~/lousta/manufacturing/books/*.txt")))
    audio = len(glob.glob(os.path.expanduser("~/lousta/manufacturing/audiobooks/*.mp3")))
    videos = len(glob.glob(os.path.expanduser("~/lousta/manufacturing/videos/*.mp4")))
    leads = len(glob.glob(os.path.expanduser("~/lousta/output/leads_database.csv")))
    
    return templates.TemplateResponse("dashboard.html", {
        "request": request,
        "books": books,
        "audio": audio,
        "videos": videos,
        "leads": leads,
        "status": "FULL SPECTRUM PRODUCTION ACTIVE",
        "abn": "54 492 524 823"
    })

@app.get("/docs", response_class=HTMLResponse)
async def read_docs(request: Request):
    with open(os.path.expanduser("~/lousta/templates/docs_content.html"), "r") as f:
        docs_html = f.read()
    return templates.TemplateResponse("docs_portal.html", {"request": request, "docs_content": docs_html})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
