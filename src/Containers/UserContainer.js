import React, { Component } from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import GroupCard from "../Components/GroupCard";
import MakeComparisonsContainer from "./MakeComparisonsContainer";
import ShowComparisonsContainer from "./ShowComparisonsContainer";

export default class UserContainer extends Component {
  handleJoinGroupSubmit = e => {
    e.preventDefault();
    let groupName = e.target.groupname.value;
    let groupId = e.target.groupid.value;
    e.target.reset();
    let data = {
      name: groupName,
      id: groupId,
      user_id: this.props.user.id
    };

    fetch(
      `https://limitless-bayou-72938.herokuapp.com/api/v1/groups/${groupId}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(response => response.json())
      .then(jsonData => this.props.getUpdatedUserInfo(this.props.user));
  };

  handleNewGroupSubmit = e => {
    e.preventDefault();

    let newGroupName = e.target.groupname.value;
    let data = {
      name: newGroupName,
      user_id: this.props.user.id
    };
    e.target.reset();
    fetch(`https://limitless-bayou-72938.herokuapp.com/api/v1/groups`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(jsonData => this.props.getUpdatedUserInfo(jsonData.users[0]));
  };

  removeDuplicates(myArr, prop) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  }

  render() {
    let user = this.props.user;
    console.log("user", user);
    if (user !== null) {
      return (
        <div className="ui container">
          <h2>Welcome, {user.name}!</h2>
          <div className="ui three doubling stackable cards">
            {this.removeDuplicates(user.groups, "id").map(group => (
              <GroupCard
                key={group.id}
                group={group}
                handleMakeClick={this.props.handleMakeClick}
                handleShowClick={this.props.handleShowClick}
                handleUserInfoUpdate={this.props.handleUserInfoUpdate}
                currentUser={user}
              />
            ))}

            <div className="card">
              <div className="content">
                <div className="header"> Create New Group</div>
                <div className="meta" />
                <div className="description" />
              </div>

              <form className="ui form" onSubmit={this.handleNewGroupSubmit}>
                <div className="field">
                  <label>Group Name</label>
                  <input
                    type="text"
                    name="groupname"
                    placeholder="Group Name"
                  />
                </div>

                <button type="submit" className="ui secondary basic button">
                  Create Group
                </button>
              </form>
            </div>

            <div className="card">
              <div className="content">
                <div className="header"> Join A Group</div>
                <div className="meta" />
                <div className="description" />
              </div>

              <form className="ui form" onSubmit={this.handleJoinGroupSubmit}>
                <div className="field">
                  <label>Group Name</label>
                  <input
                    type="text"
                    name="groupname"
                    placeholder="Group Name"
                  />
                  <label>Group ID</label>
                  <input type="number" name="groupid" placeholder="Group Id" />
                </div>

                <button type="submit" className="ui secondary basic button">
                  Join Group
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return <div />;
  }
}
