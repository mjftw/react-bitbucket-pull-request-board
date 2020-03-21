import React, { Component } from 'react'
import { Text, Box, TextInput } from 'grommet'
import { FaMinus, FaPlus } from 'react-icons/fa'

function Suggestion(props) {
    return (
        <Box
            direction='row'
            justify='between'
            onClick={(event) => props.onSelected(event.target.textContent)}
            hoverIndicator={true}>
            <Text>{props.text}</Text>
            <FaPlus />
        </Box>
    );
}

function Selection(props) {
    return (
        <Box
            direction='row'
            justify='between'
            onClick={(event) => props.onSelected(event.target.textContent)}
            hoverIndicator={true}
        >
            <Text>{props.text}</Text>
            <FaMinus />
        </Box>
    );
}

export default class PredictiveTextInput extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.deselectOption = this.deselectOption.bind(this);
        this.getEntering = this.getEntering.bind(this);

        this.state = {
            inputValue: '',
            selected: [],
            suggestions: []
        }
    }

    onChange(event) {
        const inputValue = event.target.value;

        this.setState({
            inputValue: inputValue,
            suggestions: this.getSuggestions(inputValue, this.state.selected)
        });
    }

    selectOption(value) {
        console.log(`Select: ${value}`)

        let newSelected = this.state.selected.slice();

        // Check not already selected
        if (this.state.selected.indexOf(value) < 0) {
            newSelected.push(value);
        }

        this.setState({
            inputValue: '',
            selected: newSelected,
            suggestions: []
        });
    }

    deselectOption(value) {
        console.log(`Deselect: ${value}`)

        let newSelected = this.state.selected.slice();

        // Check selected
        const index = this.state.selected.indexOf(value);
        if (index >= 0) {
            newSelected.splice(index, 1);
        }

        this.setState({
            selected: newSelected,
            suggestions: this.getSuggestions(this.state.inputValue, newSelected)
        });
    }

    getEntering(text) {
        const values = this.splitText(text, ',');
        return (values.length) ? values[values.length - 1] : '';
    }

    splitText(text, separator) {
        return text.split(separator).map(value => value.trim());
    }

    getSuggestions(text, exclude) {
        if (text.length) {
            return this.props.options.filter(word => (word.startsWith(text) && (exclude.indexOf(word) < 0)));
        }
        else {
            return [];
        }
    }

    render() {
        return (
            <Box>
                <TextInput
                    onChange={this.onChange}
                    value={this.state.inputValue}
                    {...this.props}
                />
                {this.state.selected.map(text =>
                    <Selection
                        key={text}
                        text={text}
                        onSelected={this.deselectOption}
                    />
                )}
                {this.state.suggestions.map(text =>
                    <Suggestion
                        key={text}
                        text={text}
                        onSelected={this.selectOption}
                    />
                )}
            </Box>
        );
    }
}
