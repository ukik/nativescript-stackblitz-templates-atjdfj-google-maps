import {
  Component,
  inject,
  NO_ERRORS_SCHEMA,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  CameraUpdate,
  GoogleMap,
  MapReadyEvent,
  MarkerOptions,
} from '@nativescript/google-maps';
import { GoogleMapsModule } from '@nativescript/google-maps/angular';
import { ViewShotService } from '@valor/nativescript-view-shot/angular';

@Component({
  standalone: true,
  template: `
  <GridLayout>
    <MapView (ready)="onReady($event)"></MapView>

    <ng-template #myTemplate>
      <GridLayout [backgroundColor]="markerColor" class="p-2 rounded-md border-2">
        <Label class="child-label h2">{{markerLabel}}</Label>
      </GridLayout>
    </ng-template>
  </GridLayout>
  `,
  imports: [GoogleMapsModule],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MapComponent {
  viewShotService = inject(ViewShotService);
  @ViewChild('myTemplate') template: TemplateRef<unknown>;

  map: GoogleMap;
  markerColor;
  markerLabel;

  markers: MarkerOptions[] = [
    {
      position: { lat: -32.123, lng: 123.333 },
      userData: { backgroundColor: 'pink', label: 'neat' },
    },
    {
      position: { lat: -33.123, lng: 133.333 },
      userData: { backgroundColor: 'red', label: 'cool' },
    },
    {
      position: { lat: -31.123, lng: 113.333 },
      userData: { backgroundColor: 'aqua', label: 'wow' },
    },
  ];

  async onReady(event: MapReadyEvent) {
    this.map = event.map;

    this.map.animateCamera(
      CameraUpdate.fromCoordinate(
        {
          lat: -32.123,
          lng: 123.332,
        },
        this.map.cameraPosition.zoom
      )
    );

    for (let i = 0; i < this.markers.length; i++) {
      this.markerLabel = this.markers[i].userData.label;
      this.markerColor = this.markers[i].userData.backgroundColor;

      const imgSrc = await this.viewShotService.captureInBackground(
        this.template
      );
      this.map.addMarker({ ...this.markers[i], icon: imgSrc });
    }
  }
}
