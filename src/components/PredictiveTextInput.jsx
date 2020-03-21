import React, { Component } from 'react'
import { Text, Box, TextInput } from 'grommet'

function Suggestion(props) {
    return (
        <Box
            onClick={(event) => props.onSelected(event.target.textContent)}
            hoverIndicator={true}>
            <Text>{props.value}</Text>
        </Box>
    );
}

export default class PredictiveTextInput extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onOptionSelected = this.onOptionSelected.bind(this);
        this.getEntering = this.getEntering.bind(this);
        this.getEntered = this.getEntered.bind(this);

        this.state = {
            inputValue: '',
            entering: '',
            entered: [],
            suggestions: []
        }
    }

    onChange(event) {
        const inputValue = event.target.value;
        const entering = this.getEntering(inputValue);
        const entered = this.getEntered(inputValue);

        this.setState({
            inputValue: inputValue,
            entering: entering,
            entered: entered,
            suggestions: this.getSuggestions(entering, entered)
        });
    }

    onOptionSelected(value) {
        console.log(value)
        const newInputValue = `${this.state.inputValue.slice(
            0, this.state.inputValue.length - this.state.entering.length)}${value}`

        this.setState({
            inputValue: newInputValue,
            suggestions: []
        });
    }

    getEntered(text) {
        const values = this.splitText(text, ',');

        if (values.length > 1) {
            return values.slice(0, values.length - 1);
        }
        else {
            return [];
        }
    }

    getEntering(text) {
        const values = this.splitText(text, ',');

        if (values.length) {
            return values[values.length - 1];
        }
        else {
            return '';
        }
    }

    splitText(text, separator) {
        return text.split(separator).map(value => value.trim());
    }

    getSuggestions(text, exclude) {
        console.log(`text: "${text}", exclude: ${exclude}`)
        return this.props.options.filter(word => (word.startsWith(text) && (exclude.indexOf(word) < 0)));
    }

    render() {
        console.log(`entered="${this.state.entered}" suggestions="${this.state.suggestions}"`)
        return (
            <Box>
                <TextInput
                    onChange={this.onChange}
                    value={this.state.inputValue}
                    {...this.props}
                />
                {this.state.suggestions.map(text =>
                    <Suggestion
                        key={text}
                        value={text}
                        onSelected={this.onOptionSelected}
                    />
                )}
            </Box>
        );
    }
}
