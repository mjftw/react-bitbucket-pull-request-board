import React, { Component } from 'react'
import { Text, Box, TextInput, FormField, Menu } from 'grommet'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { truncate } from '../utils/string'

function ListItem(props) {
    const text = props.length ?
        truncate(props.text, props.length, true) : props.text;

    return (
        <Box
            direction='row'
            justify='between'
            flex='grow'
            onClick={(event) => props.onSelected(props.text)}
            hoverIndicator={true}
        >
            <Text>
                <span style={{ whiteSpace: 'nowrap' }}>
                    {text}
                </span>
            </Text>
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
            inputValue: ''
        }
    }

    onChange(event) {
        const inputValue = event.target.value;

        this.setState({
            inputValue: inputValue,
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

        this.focusTextInput();
        this.setSelection(newSelected);
    }

    focusTextInput() {
        this.textInputRef.current.focus();
    }

    setSelection(selection) {
        if (this.props.setSelection !== undefined) {
            this.props.setSelection(selection);
        }
    }

    getEntering(text) {
        const values = this.splitText(text, ',');
        return (values.length) ? values[values.length - 1] : '';
    }

    splitText(text, separator) {
        return text.split(separator).map(value => value.trim());
    }

    checkStartsWith(text, checkMatch, exclude) {
        return (checkMatch.startsWith(text) && (exclude.indexOf(checkMatch) < 0));
    }

    checkWordsStartWith(text, checkMatch, exclude) {
        const checkMatchWord = checkMatch.split('-');

        // Search split text for one that starts with checkMatch
        //  and isn't in exclusions
        for (let i = 0; i < checkMatchWord.length; i++) {
            if (checkMatchWord[i].startsWith(text) && (exclude.indexOf(checkMatch) < 0)) {
                return true;
            }
        }

        return false;
    }

    checkWordIn(text, checkMatch, exclude) {
        return (checkMatch.indexOf(text) >= 0 && exclude.indexOf(checkMatch) < 0);
    }

    getSuggestions(text, exclude) {
        const strippedText = text.replace(/^[\s-]+|\s+$/g, '');

        if (strippedText.length && this.props.options) {
            return this.props.options.filter(option => {
                if (strippedText.indexOf('-') > 0) {
                    return this.checkWordIn(strippedText, option, exclude);
                }
                else {
                    return this.checkWordsStartWith(strippedText, option, exclude);
                }
            })
        }
        else {
            return [];
        }
    }

    render() {
        const suggestions = this.getSuggestions(
            this.state.inputValue, this.props.selected);

        return (
            <Box>
                <Menu
                    label='Remove selected'
                    items={
                        this.props.selected.map(text => (
                            {
                                label: text,
                                onClick: (() => this.deselectOption(text))
                            })
                        )
                    }
                />

                <FormField
                    label={this.props.label}
                    onSubmit={alert}
                >
                    <TextInput
                        onChange={this.onChange}
                        onSelect={selected => this.selectOption(selected.suggestion)}
                        value={this.state.inputValue}
                        ref={this.textInputRef}
                        suggestions={suggestions}
                        icon={this.props.icon}
                        {...this.props}
                    />
                </FormField>
            </Box>
        );
    }
}
