import { Component, OnInit } from '@angular/core';
import {
  HttpClient,
  HttpClientModule
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [HttpClientModule, CommonModule]
})
export class AppComponent implements OnInit {
  weather: any;
  selectedDayIndex: number | null = null; // Для відстеження вибраного дня

  constructor(private http: HttpClient) {}

  private apiKey = '746a88c4a60ad969a5a50b35e4f32082';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

  ngOnInit(): void {
    this.getWeather('Kiev').subscribe((data) => {
      this.weather = data;
      console.log(data);
    });
  }

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

  toggleDetails(index: number): void {
    // Якщо день вже вибрано, закрити його
    if (this.selectedDayIndex === index) {
      this.selectedDayIndex = null;
    } else {
      this.selectedDayIndex = index; // Вибрати новий день
    }
  }
}
