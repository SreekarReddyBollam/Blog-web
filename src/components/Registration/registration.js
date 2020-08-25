import React, {useEffect} from "react";
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
    useHistory
} from "react-router-dom";
import {authService} from "../../services/authService";
import {userService} from "../../services/userService";


export default function Registration(props) {
    const history = useHistory();
    const passwordValidationHelperText = "Password must be of at-least 8 characters with one special character and a number";
    const confirmPasswordMatch = "Passwords doesn't match";

    const [values, setValues] = React.useState({
        password: '',
        username: '',
        bio: '',
        firstName: '',
        lastName: '',
        profilePic: ''
    });
    const [validations, setValidations] = React.useState({
        showPassword: false,
        showConfirmPassword: false,
        isPasswordValid: true,
        isConfirmPasswordValid: true,
        isEmptyUsername: false,
        isEmptyFirstName: false,
        isEmptyLastName: false,
        errors: '',
        confirmPassword: ''
    })

    useEffect(() => {
        setValidations({
            showPassword: false,
            showConfirmPassword: false,
            isPasswordValid: true,
            isConfirmPasswordValid: true,
            errors: '',
            isEmptyUsername: false,
            isEmptyFirstName: false,
            isEmptyLastName: false,
            confirmPassword: '',
        })
        if (props.mode === 'edit' && userLoggedIn()) {
            let user = authService.currentUser();
            setValues({
                username: user.username,
                bio: user.bio,
                password: '',
                firstName: user.firstName,
                lastName: user.lastName,
                profilePic: user.profilePic,
            })
        } else {
            setValues({
                password: '',
                username: '',
                bio: '',
                firstName: '',
                lastName: '',
                profilePic: ''
            })
        }
    }, [props.mode])


    const validatePassword = (event) => {
        const PASSWORD_REGEX = /(?=.*[A-Z])(?=.*[!@#\$\&^*])(?=.*[0-9]).{8,}/;
        setValidations({...validations, isPasswordValid: PASSWORD_REGEX.test(event.target.value)})
        setValues({
            ...values,
            password: event.target.value
        })
    }


    const validateConfirmPassword = (event) => {
        setValidations({...validations, isConfirmPasswordValid: values.password === event.target.value});
    }

    const handleClickShowPassword = () => {
        setValidations({...validations, showPassword: !validations.showPassword});
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleClickShowConfirmPassword = () => {
        setValidations({...validations, showConfirmPassword: !validations.showConfirmPassword});
    }

    function handleOnChange(input) {
        return (event) => {
            setValues({...values, [input]: event.target.value});
            setValidations({
                ...validations,
                [`isEmpty${input.charAt(0).toUpperCase() + input.slice(1)}`]: event.target.value.trim() === ''
            })
        }
    }

    async function handleRegister() {
        const response = await authService.signUp(values);
        if (response.error) {
            setValidations({
                ...validations,
                errors: JSON.stringify(response.error)
            })
        }
        else
            history.push(`/users/${response.user.id}`);
    }

    async function handleLogin() {
        const response = await authService.login({
            username: values.username,
            password: values.password
        });
        if (response.error) {
            setValidations({
                ...validations,
                errors: JSON.stringify(response.error)
            })
        }
        else
            history.push(`/users/${response.user.id}`);
    }

    async function handleEdit(){
        const response = await userService.editProfile({
            'first_name':values.firstName,
            'bio':values.bio,
            'last_name':values.lastName,
            'profile_pic':values.profilePic
        });
        if (response.error) {
            setValidations({
                ...validations,
                errors: JSON.stringify(response.error)
            })
        }
        else{
            document.cookie = `user=${JSON.stringify(response.user)};max-age=3600`;
            history.push("/");
        }
    }

    async function handleDelete() {
        const response = await userService.deleteUser(authService.currentUser().id)
        if (response.error) {
            setValidations({
                ...validations,
                errors: JSON.stringify(response.error)
            })
        }
        else{
            authService.logout();
            history.push("/");
        }
    }

    const username = <TextField id="username" label="Username" variant="outlined" value={values.username}
                                error={validations.isEmptyUsername}
                                required onChange={handleOnChange('username')}/>;

    const password = <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
            id="outlined-adornment-password"
            type={validations.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={validatePassword}
            error={props.mode !== 'login' && !validations.isPasswordValid}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {validations.showPassword ? <Visibility/> : <VisibilityOff/>}
                    </IconButton>
                </InputAdornment>
            }
            labelWidth={70}
        />
        {
            !validations.isPasswordValid && props.mode !== 'login' &&
            <FormHelperText id="password-helper-text">{passwordValidationHelperText}</FormHelperText>
        }
    </FormControl>

    const confirmPassword = <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-confirm-password">Confirm Password</InputLabel>
        <OutlinedInput
            id="outlined-adornment-confirm-password"
            type={validations.showConfirmPassword ? 'text' : 'password'}
            onChange={validateConfirmPassword}
            value={validations.confirmPassword}
            error={!validations.isConfirmPasswordValid}
            endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {validations.showConfirmPassword ? <Visibility/> : <VisibilityOff/>}
                    </IconButton>
                </InputAdornment>
            }
            labelWidth={130}
        />
        {
            !validations.isConfirmPasswordValid &&
            <FormHelperText id="password-helper-text">{confirmPasswordMatch}</FormHelperText>
        }
    </FormControl>


    const firstName = <TextField id="first_name" label="First name" required
                                 error={validations.isEmptyFirstName}
                                 variant="outlined" value={values.firstName}
                                 onChange={handleOnChange('firstName')}/>;

    const lastName = <TextField id="last_name" label="Last name" required
                                error={validations.isEmptyLastName}
                                variant="outlined" value={values.lastName}
                                onChange={handleOnChange('lastName')}/>;

    const bio = <TextField id="bio" label="bio" variant="outlined"
                           multiline rows={4} value={values.bio}
                           onChange={handleOnChange('bio')}/>;

    const profilePic = <TextField id="profile_pic" label="profile pic" variant="outlined"
                                  helperText="insert link" value={values.profilePic}
                                  onChange={handleOnChange('profilePic')}/>;

    const loginButton = <Button variant="contained" onClick={handleLogin}>Login</Button>


    const registerButton = <Button variant="contained" onClick={handleRegister}>Register</Button>

    const editProfileButton = <Button variant="contained" onClick={handleEdit}>Edit Profile</Button>


    const deleteUserButton = <Button variant="contained" onClick={handleDelete} color="secondary">Delete User</Button>

    let rendered = [username, password, loginButton];

    if (props.mode === 'edit') {
        rendered = [firstName, lastName, profilePic, bio, editProfileButton, deleteUserButton];
    } else if (props.mode === 'signUp') {
        rendered = [username, password, confirmPassword, firstName, lastName, profilePic, bio, registerButton];
    }

    rendered =  rendered.concat(validations.errors);

    return (
        <div className="container">
            {rendered}
        </div>

    )

    function userLoggedIn() {
        return authService.userLoggedIn()
    }

}



