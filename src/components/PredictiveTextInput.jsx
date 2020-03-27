import React, { Component } from 'react'
import { Text, Box, TextInput } from 'grommet'
import { FaMinus, FaPlus } from 'react-icons/fa'

function ListItem(props) {
    return (
        <Box
            direction='row'
            justify='between'
            flex='grow'
            onClick={(event) => props.onSelected(props.text)}
            hoverIndicator={true}
        >
            <Text>{props.text}</Text>
            <Box width='2em' />
            {props.icon}
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
        this.focusTextInput = this.focusTextInput.bind(this);
        this.setSelection = this.setSelection.bind(this);

        this.textInputRef = React.createRef();

        this.state = {
            inputValue: '',
            suggestions: []
        }
    }

    onChange(event) {
        const inputValue = event.target.value;

        this.setState({
            inputValue: inputValue,
            suggestions: this.getSuggestions(inputValue, this.props.selected)
        });
    }

    selectOption(value) {
        let newSelected = this.props.selected.slice();

        // Check not already selected
        if (this.props.selected.indexOf(value) < 0) {
            newSelected.push(value);
        }

        this.setState({
            inputValue: '',
            suggestions: []
        });

        this.focusTextInput();
        this.setSelection(newSelected);
    }

    deselectOption(value) {
        let newSelected = this.props.selected.slice();

        // Check selected
        const index = this.props.selected.indexOf(value);
        if (index >= 0) {
            newSelected.splice(index, 1);
        }

        this.setState({
            suggestions: this.getSuggestions(this.state.inputValue, newSelected)
        });


        this.focusTextInput();
        this.setSelection(newSelected);
    }

    focusTextInput() {
        this.textInputRef.current.focus();
    }

    setSelection(selection) {
        if (this.props.onSelectionChanged !== undefined) {
            this.props.onSelectionChanged(selection);
        }
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
                    ref={this.textInputRef}
                    {...this.props}
                />
                {this.props.selected.map(text =>
                    <ListItem
                        key={text}
                        text={text}
                        icon={<FaMinus />}
                        onSelected={this.deselectOption}
                    />
                )}
                {this.state.suggestions.map(text =>
                    <ListItem
                        key={text}
                        text={text}
                        icon={<FaPlus />}
                        onSelected={this.selectOption}
                    />
                )}
            </Box>
        );
    }
}
