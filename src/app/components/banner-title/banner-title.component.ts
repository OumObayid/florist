import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-title',
  imports: [CommonModule],
  templateUrl: './banner-title.component.html',
  styleUrl: './banner-title.component.css',
})
export class BannerTitleComponent {
  @Input() title: string = '';
  @Input() underTitle: string = '';
}
