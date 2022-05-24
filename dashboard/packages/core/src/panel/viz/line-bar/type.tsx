export interface ILineBarChartSeriesItem {
  type: 'line' | 'bar';
  name: string;
  showSymbol: false;
  y_axis_data_key: string;
  stack: string;
  color?: string;
}

export interface ILineBarChartConf {
  x_axis_data_key: string;
  series: ILineBarChartSeriesItem[];
}

export interface IVizLineBarChartPanel {
  conf: ILineBarChartConf;
  setConf: (values: ILineBarChartConf) => void;
}