import React, {useState} from 'react';
import './search.styles.css';
import { withRouter } from 'react-router-dom'; //to get access to history


const Search = (props) => {
    let championNames = ["Annie", "Anivia", "Brand", "Ezreal", "Kayle", "Rammus", "Zyra", "Aatrox", "Shaco", "Sejuani", "Ashe", "Camille"]
    console.log('search component rendered');
    console.log(props)
    const [searchTerm, setSearchTerm] = useState('');
    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    }

    const handleSubmit= (event) => {
        event.preventDefault();
        console.log('you searched for = ' + searchTerm);
    }

    

    return (
        <div className="container">
            <div className="container__item">
                <form onSubmit={handleSubmit} className="form">
                    <input autoComplete="off" placeholder="Search for a champion" list="champions" type="text" className="form__field" name="search" onChange={handleChange} value={searchTerm}/>
                    <datalist id="champions">
                        {
                            championNames.map((championName, index) => {
                                if(championName.toLowerCase().startsWith(searchTerm.toLowerCase()) && searchTerm.length > 0){
                                    return <option key={index} value={championName}/>
                                } else {
                                    return null;
                                }
                            })
                        }
                        
                    </datalist>
                    <button type='submit' className="btn btn--primary btn--inside uppercase" onClick={() => props.history.push(`/champions/${searchTerm}`)}>Search</button>
                </form>
            </div>
        </div>

    )
}

export default withRouter(Search);