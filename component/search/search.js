import style from "./search.module.css"

const Search = ({Visible, closeClick}) => {
    // const []
    if(!Visible) return null;

    const clickHendle = (e) => {
        if(e.target.id === "search") closeClick;
    }

    return (
        <div className={style.searchBox} id="search" onClick={clickHendle}>
            <input className={style.input} placeholder="Cari barang"></input>
            <div className={style.button}>
                <button className={style.buttonX} onClick={() => closeClick()}>x</button>
            </div>
        </div>
    )
}

export default Search;