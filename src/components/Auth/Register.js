import React from 'react'
import { Grid, Form, Button, Segment, Header, Message, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import firebase from '../../firebase'
import md5 from 'md5'

class Register extends React.Component {

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        userRef: firebase.database().ref('users')
    }

    isFormValid = () => {
        let errors = []
        let error;

        if (this.isFormEmpty(this.state)) {
            error = { message: "Please fill out all fields" }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else if (!this.isPasswordValid(this.state)) {
            error = { message: "Password is Invalid" }
            this.setState({ errors: errors.concat(error) })
            return false
        }
        else {
            //form valid
            return true
        }
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {

        if (password.length < 6 || passwordConfirmation.length < 6 || password !== passwordConfirmation) {
            return false
        }
        else return true
    }

    isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length
    }

    handleChange = (event) => {
        console.log(event.target.name)
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        if (this.isFormValid()) {
            this.setState({ errors: [], loading: true })
            firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
                .then((createdUser) => {
                    console.log(createdUser)
                    createdUser.user.updateProfile({
                        displayName: this.state.username,
                        photoURL: `http://gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                    })
                    .then(() => {
                        this.saveUser(createdUser).then(() => {
                            console.log("User saved")
                        })
                    })
                    .catch((err) => {
                        this.setState({
                            errors: this.state.errors.concat(err),
                            loading: false
                        })
                    })
                })
                .catch((err) => {
                    const message = err.message
                    this.setState((prevState) => ({ errors: prevState.errors.concat({ message }), loading: false }))
                    // this.setState({ errors: this.state.errors.concat({ error }), loading: false })
                    console.log(err)
                })
        }
    }

    displayError = (errors) => {
        return errors.map((error, index) => <p key={index}>{error.message}</p>)
    }

    saveUser = createdUser => {
        return this.state.userRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL
        })
    }

    handleInputError = (errors, inputName) => {
        return errors.some((error) => error.message.toLowerCase().includes(inputName)) ? 'error' : ''
    }

    render() {
        const { username, email, password, passwordConfirmation, errors, loading } = this.state
        return (
            <Grid textAlign="center" verticalAlign="middle" className="app">
                <Grid.Column style={{ maxWidth: 450, backgroundColor: "hotpinnk" }}>
                    <Header as="h1" icon color="orange">
                        <Icon name="puzzle piece" color="orange" />
                            Register for DevChat
                    </Header>

                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input fluid name="username" icon="user" iconPosition="left"
                                placeholder="Username" type="text" onChange={this.handleChange} value={username}
                                className={this.handleInputError(errors, 'username')} />

                            <Form.Input fluid name="email" icon="mail" iconPosition="left"
                                placeholder="Email" type="email" onChange={this.handleChange} value={email}
                                className={this.handleInputError(errors, 'email')} />

                            <Form.Input fluid name="password" icon="lock" iconPosition="left"
                                placeholder="Password" type="password" onChange={this.handleChange} value={password}
                                className={this.handleInputError(errors, 'password')} />

                            <Form.Input fluid name="passwordConfirmation" icon="repeat" iconPosition="left"
                                placeholder="Confirm Password" type="password" onChange={this.handleChange} value={passwordConfirmation}
                                className={this.handleInputError(errors, 'password')} />

                            <Button color="orange" animated='fade' size="large" className={loading ? 'loading' : ''} disabled={loading}>
                                <Button.Content visible>Sign-up</Button.Content>
                                <Button.Content hidden>It's free!</Button.Content>
                            </Button>
                        </Segment>
                    </Form>
                    {this.state.errors.length > 0 && <Message error> <h3>Error</h3>{this.displayError(errors)} </Message>}
                    <Message>Already a user? <Link to="/login"> Click here </Link></Message>
                </Grid.Column>
            </Grid>
        )
    }
}

export default Register