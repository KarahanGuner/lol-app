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

  const observer = useRef(); //returns an object with current property is what we initialize it with. this object lasts between re-renders but doesnt cause a re-render when it changes. that's its difference between "state".
  
  const lastMatchElementRef = useCallback(node => { // whenever a new element is created with "lastMatchElementRef" the function inside of "useCallback" is run. this is a special interaction between "ref" attribute in elements and "useCallback"
    if (observer.current) observer.current.disconnect(); //get rid of the previous IntersectionObserver
    observer.current = new IntersectionObserver(entries => { //code inside "IntersectionObserver" is run whenever one of the entries is on the screen.
      if(entries[0].isIntersecting){
        setPageNumber(pageNumber + 1);
      }
    });
    if (node) observer.current.observe(node); //here we are telling "IntersectionObserver" to watch this node. "IntersectionObserver" takes its paramter "entries" from this "observe" method.
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
