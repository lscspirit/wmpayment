"use strict";

import React from "react";
import PropTypes from "prop-types";
import {
  Panel, Row, Col, Form, FormGroup,
  ControlLabel, FormControl, HelpBlock,
  Button
} from "react-bootstrap";
import check from "check-types";

import { ModelErrors } from "~/models/base";

class SearchForm extends React.PureComponent {
  render() {
    const button_content = this.props.loading ? (
      <span>
        <span className="fa fa-spinner fa-spin fa-fw" style={{marginRight: 5}}/>
        Searching
      </span>
    ) : "Search";

    const id_errors   = this.props.formErrors.get("tId");
    const name_errors = this.props.formErrors.get("tName");

    return (
      <Panel header="Payment Search" bsStyle="primary">
        <Form>
          <FormGroup controlId="t_id" validationState={ id_errors.length > 0 ? "error" : null }>
            <ControlLabel>Transaction Id</ControlLabel>
            <FormControl type="input"
              disabled={ this.props.loading }
              value={ this.props.tId }
              onChange={ this.props.onChange.bind(null, "tId") }
              placeholder="Transaction Id"/>
            <HelpBlock>{ id_errors.length > 0 ? id_errors.join(', ') : null }</HelpBlock>
          </FormGroup>
          <FormGroup controlId="t_name" validationState={ name_errors.length > 0 ? "error" : null }>
            <ControlLabel>Customer Name</ControlLabel>
            <FormControl type="input"
              disabled={ this.props.loading }
              value={ this.props.tName }
              onChange={ this.props.onChange.bind(null, "tName") }
              placeholder="Customer Name"/>
            <HelpBlock>{ name_errors.length > 0 ? name_errors.join(', ') : null }</HelpBlock>
          </FormGroup>
        </Form>
        <Row>
          <Col sm={12}>
            <Button bsStyle="primary"
              disabled={ this.props.loading }
              onClick={ this.props.onSubmit } block>
              { button_content }
            </Button>
          </Col>
        </Row>
      </Panel>
    );
  }
}
SearchForm.propTypes = {
  loading:  PropTypes.bool.isRequired,
  tId:      PropTypes.string,
  tName:    PropTypes.string,
  formErrors: PropTypes.instanceOf(ModelErrors).isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default class SearchFormContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = this._freshState();

    this._onValueChange = this._onValueChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._validate = this._validate.bind(this);
  }

  render() {
    return <SearchForm
      loading={this.state.loading}
      tId={this.state.tId}
      tName={this.state.tName}
      formErrors={this.state.formErrors}
      onChange={this._onValueChange}
      onSubmit={this._onSubmit}/>;
  }

  //
  // Private Methods
  //

  _freshState() {
    return {
      loading: false,
      tId: "",
      tName: "",
      formErrors: new ModelErrors()
    };
  }

  _onValueChange(field, evt) {
    this.setState({
      [field]: evt.target.value
    });
  }

  _onSubmit() {
    const errors = this._validate();

    if (errors.isEmpty()) {
      // if there is no error in the form

      this.props.onSubmit(this.state.tId, this.state.tName).then(() => {
        this.setState(this._freshState());
      }, err => {
        this.setState({ loading: false });
      });

      this.setState({
        loading: true,
        formErrors: errors
      });
    } else {
      // if there is error
      this.setState({
        formErrors: errors
      });
    }
  }

  _validate() {
    const errors = new ModelErrors();

    if (!check.nonEmptyString(this.state.tId)) {
      errors.add("tId", "must not be empty");
    }

    if (!check.nonEmptyString(this.state.tName)) {
      errors.add("tName", "must not be empty");
    }

    return errors;
  }
}
SearchFormContainer.propTypes = {
  onSubmit: PropTypes.func.isRequired
}