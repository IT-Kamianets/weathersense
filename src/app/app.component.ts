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
  selectedDayIndex: number | null = 0; // За замовчуванням вибрано перший день (сьогодні)
  dailyForecasts: any[] = []; // Для зберігання унікальних днів

  constructor(private http: HttpClient) {}

  private apiKey = '746a88c4a60ad969a5a50b35e4f32082';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
  ngOnInit(): void {
    this.getWeather('Kamyanets-Podilsky').subscribe((data) => {
        this.weather = data;
        this.extractDailyForecasts();
        console.log(data);
        
        // Встановлюємо сьогоднішній день як вибраний
        this.selectToday();
        this.selectedDayIndex = 0; // Відкриваємо прогноз на сьогоднішній день за замовчуванням
    });
  }

  getWeather(city: string): Observable<any> {
    const url = `${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url);
  }

  extractDailyForecasts(): void {
    const uniqueDays = new Set();
    this.dailyForecasts = [];

    this.weather.list.forEach((forecast: any) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.toDateString();

      if (!uniqueDays.has(day)) {
        uniqueDays.add(day);
        this.dailyForecasts.push({
          date: day,
          forecasts: [],
          minTemp: Infinity, // Ініціалізуємо з безкінечності
          maxTemp: -Infinity // Ініціалізуємо з -безкінечності
        });
      }

      const dailyIndex = this.dailyForecasts.findIndex(d => d.date === day);
      if (dailyIndex !== -1) {
        this.dailyForecasts[dailyIndex].forecasts.push(forecast);
        
        // Оновлюємо мінімальну і максимальну температуру
        this.dailyForecasts[dailyIndex].minTemp = Math.min(this.dailyForecasts[dailyIndex].minTemp, forecast.main.temp);
        this.dailyForecasts[dailyIndex].maxTemp = Math.max(this.dailyForecasts[dailyIndex].maxTemp, forecast.main.temp);
      }
    });
  }

  selectToday(): void {
    const today = new Date().toDateString();
    this.selectedDayIndex = this.dailyForecasts.findIndex(d => d.date === today);
  }

  toggleDetails(index: number): void {
    // Якщо день вже вибрано, залишаємо його відкритим
    if (this.selectedDayIndex !== index) {
        this.selectedDayIndex = index; // Вибираємо новий день, не закриваючи
    }
  }
}
