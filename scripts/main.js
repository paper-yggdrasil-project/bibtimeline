var data = {
  "title": {
    "text": {
      "headline": "Sample Bibliography Timeline",
      "text": "more easy to remember paper history"
    }
  },
  "events": [
    {
      "start_date": {
        "year": "2015"
      },
      "text": {
        "headline": "Sample Title 15",
        "text": "S Kato<br>BibTimeline<br>abs/xxxx.xxxx<br>https://github.com/paper-yggdrasil-project/bibtimeline/app/bib/sample.bib"
      },
      "media": {
        "url": "<iframe src='./attachments/sample15.html' frameborder='0'>"
      }
    },
    {
      "start_date": {
        "year": "2014"
      },
      "text": {
        "headline": "Sample Title 14",
        "text": "S Kato<br>BibTimeline<br>abs/xxxx.xxxx<br>https://github.com/paper-yggdrasil-project/bibtimeline/app/bib/sample.bib"
      },
      "media": {
        "url": "./attachments/sample14.pdf"
      }
    },
    {
      "start_date": {
        "year": "2011"
      },
      "text": {
        "headline": "Sample Title 11",
        "text": "S Kato<br>BibTimeline<br>abs/xxxx.xxxx<br>https://github.com/paper-yggdrasil-project/bibtimeline/app/bib/sample.bib"
      }
    },
    {
      "start_date": {
        "year": "2000"
      },
      "text": {
        "headline": "Sample Title 00",
        "text": "S Kato<br>BibTimeline<br>abs/xxxx.xxxx<br>https://github.com/paper-yggdrasil-project/bibtimeline/app/bib/sample.bib"
      }
    },
    {
      "start_date": {
        "year": "1999"
      },
      "text": {
        "headline": "Sample Title 99",
        "text": "S Kato<br>BibTimeline<br>abs/xxxx.xxxx<br>https://github.com/paper-yggdrasil-project/bibtimeline/app/bib/sample.bib"
      }
    }
  ]
};
var timeline = new TL.Timeline('timeline-embed', data);
console.log('\'Allo \'Allo!');
