import { IRadarChartConf } from '../type';
import { getFormatter } from './formatter';

export function getTooltipFormatter(conf: IRadarChartConf) {
  return ({ name, marker, value }: { name: string; value: number[]; marker: string }) => {
    if (value.length === 0) {
      return '';
    }
    const lines = value.map((v, i) => {
      const dimension = conf.dimensions[i];
      const formatter = getFormatter(dimension.formatter);
      return `
    <tr>
      <td style="padding-left: 18px;">${dimension.name}</td>
      <td style="text-align: right; "><strong>${formatter(v)}</strong></td>
    </tr>
    `;
    });

    return `
  <table>
    <thead>
      <tr>
        <th colspan="2">
          ${marker}
          <strong
            style="
              max-width: 15em;
              display: inline-block;
              word-break: break-all;
              white-space: pre-line;
              text-align: left;
              vertical-align: top;
            "
          >${name}</strong>
        </th>
      </tr>
    </thead>
    <tbody>
      ${lines.join('')}
    </tbody>
  </table>
  `;
  };
}
