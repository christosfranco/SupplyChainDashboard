import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_networkgraph from 'highcharts/modules/networkgraph';
import {PanZoomConfig, PanZoomConfigOptions} from "ngx-panzoom";
HC_networkgraph(Highcharts);

@Component({
  selector: 'app-high-charts-vis',
  templateUrl: './high-charts-vis.component.html',
  styleUrls: ['./high-charts-vis.component.scss']
})
export class HighChartsVisComponent {
  Highcharts: typeof Highcharts = Highcharts;

  private panZoomConfigOptions: PanZoomConfigOptions = {
    zoomLevels: 10,
    scalePerZoomLevel: 2.0,
    zoomStepDuration: 0.2,
    freeMouseWheelFactor: 0.01,
    zoomToFitZoomLevelFactor: 0.9,
    dragMouseButton: 'left'
  };

  panZoomConfig: PanZoomConfig = new PanZoomConfig(this.panZoomConfigOptions);

  chartOptions: Highcharts.Options = {
    chart: {
      type: 'networkgraph'
    },
    title: {
      text: ''
    },
    credits: {
      enabled: false
    },


    plotOptions: {
      networkgraph: {
        keys: ['from', 'to'],
        layoutAlgorithm: {
          enableSimulation: false,
          friction: 0.0,
        },
      },
    },

    series: [
      {
        marker: {
          radius: 10,
        },
        point: {
          events: {
            click(e) {
              alert('Name: ' + e.point.name + ' Color: ' + e.point.color);
            }
          }
        },
        type: 'networkgraph',
        dataLabels: {
          enabled: true
        },
        data: [
          ['Miracle Mile Medical Center', 'Samer Alaiti M.D.'],
          ['Miracle Mile Medical Center', 'Platinum Toxicology'],
          ['Vantage Toxicology Management', 'Platinum Toxicology'],
          ['West Oaks Orthopaedic', 'Southern California Orthopedic Institute'],
          ['Chaparral Medical Group Inc', 'Internal Medicine Medical Group'],
          ['Vantage Toxicology Management', 'Internal Medicine Medical Group'],
          ['Chaparral Medical Group Inc', 'West Oaks Orthopaedic'],
          ['Miracle Mile Medical Center', 'Platinum Toxicology'],
          ['Vantage Toxicology Management', 'Andrew D Rah MD'],
          ['Vantage Toxicology Management', 'Norman N Nakata MD'],
          ['Vantage Toxicology Management', 'Joanne Halbrecht M.d'],
          ['Vantage Toxicology Management', 'Ronald J Gowey MD'],
          ['Vantage Toxicology Management', 'Mohammad Sirajullah MD'],
          ['West Oaks Orthopaedic', 'Chaparral Medical Group Inc'],
          [
            'West Oaks Orthopaedic',
            'Hospitalists Corporation of Inland Empire',
          ],
          ['West Oaks Orthopaedic', 'Robert L Horner M.D.'],
          ['West Oaks Orthopaedic', 'Mark H Hyman MD Inc'],
          ['Chaparral Medical Group Inc', 'Precision Occ MED Grp Inc.'],
          ['Precision Occ MED Grp Inc.', 'Gary Phillip Jacobs MD Inc'],
          ['Precision Occ MED Grp Inc.', 'Wellness Wave LLC'],
          ['Precision Occ MED Grp Inc.', 'Precision Occ MED Grp Inc'],
          [
            'Precision Occ MED Grp Inc.',
            'Precision Occupational Medical Group, Inc.',
          ],
          ['Precision Occ MED Grp Inc.', 'Samer Alaiti MD Inc'],
          ['Precision Occ MED Grp Inc.', 'Lotus Laboratories'],
          ['Precision Occ MED Grp Inc.', 'Ontario Medical Center L'],
          ['Precision Occ MED Grp Inc.', 'Leo Newman'],
          ['Precision Occ MED Grp Inc.', 'Ca Diagnostic Specialists Inc'],
          ['Precision Occ MED Grp Inc.', 'Physiolink'],
          ['Precision Occ MED Grp Inc.', 'Matrix Rehabilitation Inc'],
          ['Precision Occ MED Grp Inc.', 'Kaiser Foundation Hospitals'],
        ],
        nodes: [{
          id: 'Precision Occ MED Grp Inc.',
          color: 'blue'
        }, {
          id: 'West Oaks Orthopaedic',
          color: 'red'
        }, {
          id: 'Vantage Toxicology Management',
          color: 'orange'
        }
        ]
      },
    ],
  };
}
