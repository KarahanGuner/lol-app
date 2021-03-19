import React, {useState, useRef, useEffect, useCallback} from 'react';
import './championdetailsbottom.styles.css';
import ResultRow from  '../resultrow/resultrow.component';
import ResultRowHeader from  '../resultrowheader/resultrowheader.component';
import Spinner from '../../components/spinner/spinner.component';
import {Link} from 'react-router-dom';

function ChampionDetailsBottom(props) {
  const [versusInput, changeVersusInput] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [matches, setMatches] = useState([]);

  const observer = useRef();
  
  const lastMatchElementRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting){
        setPageNumber(pageNumber + 1);
      }
    });
    if (node) observer.current.observe(node);
  });

  useEffect(() => {
    if(versusInput) {
      setMatches(props.matches.filter(match => match.versus.replace(/\s/g, '').toLowerCase().includes(versusInput.replace(/\s/g, '').toLowerCase())).slice(0, 30*pageNumber));
    } else {
      setMatches(props.matches.slice(0, 30*pageNumber));
    }
  }, [versusInput, pageNumber, props.matches]);

  const handleChange = (e) => {
    changeVersusInput(e.target.value);
    setPageNumber(1);
  }
  
  return (
    <div className="championdetailsbottom">
      {!props.loading ? <div className="results-container">
        <div className="versus-input-container"><input placeholder="Search versus" value={versusInput} id="versus-input-box" onChange={handleChange}/></div>
        <ResultRowHeader></ResultRowHeader> 
        {matches.map((match, i) => {
          if((i == pageNumber*30-1) && (i != props.matches.length-1)){
            return <Link ref={lastMatchElementRef} key={i} style={{textDecoration: 'none'}} to={`/matches/${match.server}/${match.gameId}/${props.championName}`}><ResultRow championDdragonName={props.championDdragonName} match={match}/></Link>
          }
          return <Link key={i} style={{textDecoration: 'none'}} to={`/matches/${match.server}/${match.gameId}/${props.championName}`}><ResultRow championDdragonName={props.championDdragonName} match={match}/></Link>
        })}
      </div> : <Spinner/>}

      
    </div>
  );
}

export default ChampionDetailsBottom;
