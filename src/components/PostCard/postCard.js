import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import React from 'react';
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import './postCard.css'
import {Link} from "react-router-dom";

export default class PostCard extends React.Component {
    render() {
        return (

            <Card className="card">
                <CardActionArea disabled>
                    <CardMedia
                        component="img"
                        alt={this.props.post.title}
                        height="140"
                        image={this.props.post.imageUrl}
                        title="Contemplative Reptile"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {this.props.post.title}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Link to={`/users/${this.props.user_id}/posts/${this.props.post.id}`}>
                            <Button size="small" color="primary">
                                Learn More
                            </Button>
                    </Link>
                </CardActions>
            </Card>
        )
    }
}