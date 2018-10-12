import React, {Component} from 'react'
import logo from './cool.jpg'
import {connect} from 'react-redux'
import {updateUser} from '../../ducks/reducer'
import axios from 'axios';



class Auth extends Component{
    async componentDidMount(){
        let res = await axios.get('/api/user-data')
        this.props.updateUser(res.data)
    }

    login(){
        let{REACT_APP_DOMAIN, REACT_APP_CLIENT_ID}=process.env

        let uri = `${encodeURIComponent(window.location.origin)}/auth/callback`

        window.location =`https://${REACT_APP_DOMAIN}/authorize?client_id=${REACT_APP_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${uri}&response_type=code`
    }
    render(){
        return(
            <div>
                <h1>This is the BEST WEBSITE EVERRRRRRRRRR!!!!!!!</h1>
              <img src={logo} alt=''/>
                <button onClick={this.login}>Login</button> 
            </div>
        )
    }
}

function mapStateToProps(state){
    return{
        user: state.user
    }

}

export default connect(mapStateToProps,{updateUser})(Auth)