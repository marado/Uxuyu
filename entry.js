import React, {
  Component,
} from "react";
import {
  Button,
  TextInput,
  View,
} from "proton-native";

const fs = require('fs');
const moment = require('moment');
const opn = require('open');

export default class Entry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultPostText: '',
      longMsg: false,
    };
    this.postText = '';
    this.boundPostTweet = this.postTweet.bind(this);
  }

  tweetUpdated(text) {
    this.postText = text;
    this.setState({
      longMsg: this.postText.length >
        Number(this.props.twtxt.character_warning),
    });
  }

  postTweet() {
    const ts = moment().format();
    const feedFile = fs.readFileSync(
      this.props.twtxt.twtfile,
      'utf-8'
    );
    let post = `${ts}\t${this.postText}`;

    if (!feedFile.endsWith('\n')) {
      post = `\n${post}`;
    }
    fs.appendFileSync(
      this.props.twtxt.twtfile,
      post
    );
    this.setState({
      defaultPostText: this.postText,
    });
    this.postText = '';
    this.setState({
      defaultPostText: '',
    });
    if (this.props.twtxt.hasOwnProperty('post_tweet_hook')
      && this.props.twtxt.post_tweet_hook.length > 0) {
      try {
        opn(
          this.props.twtxt.post_tweet_hook,
          {
            app: 'bash',
          }
        );
      } catch(e) {
        console.error(e);
      }
    }
  }

  render() {
    return (
      <View style={{
        alignItems: 'flex-start',
        flex: 1,
        flexDirection: 'row',
        height: '40px',
        justifyContent: 'flex-start',
        maxHeight: '40px',
        width: '100%',
      }}>
        <TextInput
          onChangeText={text => this.tweetUpdated(text)}
          style={{
            backgroundColor: this.state.longMsg
              ? 'darkred'
              : this.props.config.backgroundColor,
            border: '1px solid ' + this.props.config.foregroundColor,
            color: this.state.longMsg
              ? 'lightyellow'
              : this.props.config.foregroundColor,
            fontSize: `${this.props.config.fontSize}pt`,
            height: '40px',
            width: '89%',
          }}
          value={this.state.defaultPostText}
        />
        <Button
          onPress={this.boundPostTweet}
          style={{
            backgroundColor: this.props.config.backgroundColor,
            border: '1px solid ' + this.props.config.foregroundColor,
            borderRadius: `${this.props.config.fontSize / 2}px`,
            fontWeight: 'bold',
            color: this.props.config.foregroundColor,
            fontSize: `${this.props.config.fontSize}pt`,
            height: '40px',
            marginLeft: '0.5%',
            width: '10%',
          }}
          title='Post'
        />
      </View>
    );
  }
}
