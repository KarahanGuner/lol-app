import React from 'react';
import './championdetailsbottom.styles.css';


function ChampionDetailsBottom() {

  return (
    <div className="championdetailsbottom">
      <div className="table-container">
        <table>
          <tr onClick={() => {console.log('asd')}}>
            <th>Challenger</th>
            <th> </th>
            <th> </th>
            <th>vs.</th>
            <th>Score</th>
            <th>Lane</th>
            <th>Final Build</th>
            <th>Gold</th>
            <th>Key Stone</th>
            <th>S. Spells</th>
          </tr>
          <tr>
            <td>Jill</td>
            <td>KK</td>
            <td>X</td>
            <td>KK</td>
            <td>50</td>
            <td>22</td>
            <td>SSSSSSSSSSSSSSSSSSSSSSSSSSS</td>
            <td>22</td>
            <td>50</td>
            <td>50</td>
          </tr>
          <tr>
            <td>Eve</td>
            <td>KK</td>
            <td>X</td>
            <td>KK</td>
            <td>94</td>
            <td>94</td>
            <td>94</td>
            <td>94</td>
            <td>94</td>
            <td>94</td>
          </tr>
          <tr>
            <td>Adam</td>
            <td>KK</td>
            <td>X</td>
            <td>KK</td>
            <td>67</td>
            <td>67</td>
            <td>67</td>
            <td>67</td>
            <td>67</td>
            <td>67</td>
          </tr>
        </table>
      </div>
      
    </div>
  );
}

export default ChampionDetailsBottom;
