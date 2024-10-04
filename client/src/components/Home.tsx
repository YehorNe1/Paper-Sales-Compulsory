import Navigation from "./Navigation.tsx";
import '../index.css'
import '../App.css'

const Home = () => {
    return (
        <>
            <Navigation></Navigation>

            <a href="/Home">Home</a>
            <br/>
            <a href="/customers">Customers</a>
            <br/>

            <a href="/admin">Admin Page</a>


        </>
    )
}

export default Home;