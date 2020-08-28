import React from "react";
import {TextField} from "@material-ui/core";
import './registration.css';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import Button from "@material-ui/core/Button";
import {
    withRouter
} from "react-router-dom";
import {authService} from "../../services/authService";
import {userService} from "../../services/userService";


class Registration extends React.Component {

    passwordValidationHelperText = "Password must be of at-least 8 characters with one special character and a number";

    constructor(props) {
        super(props);
        this.state = this.getStateObject();
    }

    componentDidMount() {

        this.isPasswordValid = true;
        this.isEmptyUsername = false;
        this.isEmptyFirstName = false;
        this.isEmptyLastName = false;

        const user = authService.currentUser()
        this.setState(this.getStateObject());
        if (this.props.mode === 'edit' && authService.currentUser()) {
            userService.getUser(user.id).then(user=>{
                this.setState({
                    bio: user.bio ? user.bio : '',
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePic: user.profilePic ? user.profilePic : '',
                })
            }).catch(err=>{
                this.props.histroy.push("/Oh404Page")
            })
        }
    }

    validatePassword = (event) => {
        const PASSWORD_REGEX = /(?=.*[A-Z])(?=.*[!@#\$\&^*])(?=.*[0-9]).{8,}/;
        this.isPasswordValid = PASSWORD_REGEX.test(event.target.value)
        this.setState({
            password: event.target.value
        })
    }

    handleClickShowPassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    };

    handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    handleOnChange(input) {
        return (event) => {
            this.setState({[input]: event.target.value});
            this[`isEmpty${input.charAt(0).toUpperCase() + input.slice(1)}`] = event.target.value.trim() === '';
        }
    }

    handleRegister = () => {
        authService.signUp({
            username: this.state.username,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            profilePic: this.state.profilePic,
            password: this.state.password,
            bio: this.state.bio
        }).then(data => {
            this.props.history.push(`/users/${data.user.id}`);
        }).catch(err => {
            this.setState({
                errors: err.message
            });
        })

    }

    handleLogin = () => {
        authService.login({
            username: this.state.username,
            password: this.state.password
        }).then(body => {
            this.props.history.push(`/users/${body.user.id}`);
        }).catch(err => {
            this.setState({
                errors: err.message
            });
        });
    }


    handleEdit = () => {
        userService.editProfile({
            'first_name': this.state.firstName,
            'bio': this.state.bio,
            'last_name': this.state.lastName,
            'profile_pic': this.state.profilePic
        }).then(body => {
            this.props.history.push("/");
        }).catch(err => {
            this.props.histroy.push("/Oh404Page")
        })
    }

    handleDelete = () => {
        userService.deleteUser(authService.currentUser().id).then(body => {
            this.props.history.push("/");
        }).catch(err => {
            this.props.histroy.push("/Oh404Page")
        });
    }


    render() {
        const username = <TextField id="username" label="Username" variant="outlined" value={this.state.username}
                                    error={this.isEmptyUsername}
                                    required onChange={this.handleOnChange('username')}/>;

        const password = <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                type={this.state.showPassword ? 'text' : 'password'}
                value={this.state.password}
                onChange={this.validatePassword}
                error={this.props.mode !== 'login' && !this.isPasswordValid}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={this.handleClickShowPassword}
                            onMouseDown={this.handleMouseDownPassword}
                            edge="end"
                        >
                            {this.state.showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                }
                labelWidth={70}
            />
            {!this.isPasswordValid && this.props.mode !== 'login' &&
            <FormHelperText id="password-helper-text">{this.passwordValidationHelperText}</FormHelperText>
            }
        </FormControl>

        const firstName = <TextField id="first_name" label="First name" required
                                     error={this.isEmptyFirstName}
                                     variant="outlined" value={this.state.firstName}
                                     onChange={this.handleOnChange('firstName')}/>;

        const lastName = <TextField id="last_name" label="Last name" required
                                    error={this.isEmptyLastName}
                                    variant="outlined" value={this.state.lastName}
                                    onChange={this.handleOnChange('lastName')}/>;

        const bio = <TextField id="bio" label="bio" variant="outlined"
                               multiline rows={4} value={this.state.bio}
                               onChange={this.handleOnChange('bio')}/>;

        const profilePic = <TextField id="profile_pic" label="profile pic" variant="outlined"
                                      helperText="insert link" value={this.state.profilePic}
                                      onChange={this.handleOnChange('profilePic')}/>;

        const loginButton = <Button variant="contained" onClick={this.handleLogin}>Login</Button>


        const registerButton = <Button variant="contained" onClick={this.handleRegister}>Register</Button>

        const editProfileButton = <Button variant="contained" onClick={this.handleEdit}>Edit Profile</Button>


        const deleteUserButton = <Button variant="contained" onClick={this.handleDelete} color="secondary">Delete
            User</Button>

        let rendered = [username, password, loginButton];

        if (this.props.mode === 'edit') {
            rendered = [firstName, lastName, profilePic, bio, editProfileButton, deleteUserButton];
        } else if (this.props.mode === 'signUp') {
            rendered = [username, password, firstName, lastName, profilePic, bio, registerButton];
        }
        rendered = rendered.concat(this.state.errors);

        return (
            <div className="container">
                {rendered}
            </div>

        )
    }


    getStateObject() {
        return {
            password: '',
            username: '',
            bio: '',
            firstName: '',
            lastName: '',
            profilePic: '',
            errors: '',
            showPassword: false
        }
    }
}

export default withRouter(Registration)



