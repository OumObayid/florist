import { Component } from '@angular/core';
import { BannerTitleComponent } from "../../components/banner-title/banner-title.component";
import { RouterLink } from "@angular/router";
import { LinkButtonComponent } from '../../components/link-buton/link-buton.component';

@Component({
  selector: 'app-about',
  imports: [BannerTitleComponent, RouterLink,LinkButtonComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

}
