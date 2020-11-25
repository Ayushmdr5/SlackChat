import React from 'react'
import { Grid, Form, Button, Segment, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'

class Login extends React.Component {

    state = {
        email: '',
        password: '',
        errors: [],
        loading: false,
    }

    handleChange = (event) => {
        console.log(event.target.name)
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if (this.isFormValid(this.state)) {
            this.setState({ errors: [], loading: true })
            firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(signedInUser => {
                console.log(signedInUser)
                this.setState({loading: false})
            })
            .catch((err) => {
                console.log(err)
                this.setState({errors: this.state.errors.concat(err), loading: false})
            })
            
        }
    }

    isFormValid = ({email, password}) => email && password

    displayError = (errors) => {
        return errors.map((error, index) => <p key={index}>{error.message}</p>)
    }

    handleInputError = (errors, inputName) => {
        return errors.some((error) => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render() {
        const { email, password, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450, backgroundColor: "hotpinnk" }}>
                    <Header as="h1" icon color="violet">
                        <Icon name="code branch" color="violet" />
                            Login to DevChat
                    </Header>

                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>

                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                                placeholder="Email" type="email" onChange={this.handleChange} value={email}
                                className={this.handleInputError(errors, 'email')} />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                                placeholder="Password" type="password" onChange={this.handleChange} value={password}
                                className={this.handleInputError(errors, 'password')} />

                            <Button color="violet" animated='fade' size="large" className={loading ? 'loading' : ''} disabled={loading}>
                                <Button.Content visible>Sign-up</Button.Content>
                                <Button.Content hidden>It's free!</Button.Content>
                            </Button>
                        </Segment>
                    </Form>
                    {this.state.errors.length > 0 && <Message error> <h3>Error</h3>{this.displayError(errors)} </Message>}
                    <Message>Don't have an account? <Link to="/register"> Register here </Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Login