import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  imageList = [];
  nextPage = "https://picsum.photos/v2/list?page=1";

  constructor(private http: HttpClient) {
    this.loadImages();
  }

  loadImages(event?) {
    this.http
      .get<any[]>(this.nextPage, { observe: "response" })
      .subscribe(res => {
        console.log("res", res);
        console.log(this.parse_link_header(res.headers.get("Link")));
        this.nextPage = this.parse_link_header(res.headers.get("Link"))["next"];
        this.imageList =
          this.imageList.length == 0
            ? res.body
            : [...this.imageList, ...res.body];

        if (event) {
          event.target.complete();
        }
      });
  }

  // https://www.techiediaries.com/angular-httpclient-headers-full-response/
  parse_link_header(header) {
    if (header.length == 0) {
      return;
    }

    let parts = header.split(",");
    var links = {};
    parts.forEach(p => {
      let section = p.split(";");
      var url = section[0].replace(/<(.*)>/, "$1").trim();
      var name = section[1].replace(/rel="(.*)"/, "$1").trim();
      links[name] = url;
    });
    return links;
  }
}
