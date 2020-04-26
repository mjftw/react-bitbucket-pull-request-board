import React, { Component } from 'react'
import { Box, Select, CheckBox, Text } from 'grommet'


function MenuOption(props) {
    return (
        <Box direction='row'>
            <CheckBox
                checked={props.checked}
            />
            <Box width='1em'/>
            <Text>{props.text}</Text>  
        </Box>
    );
}

export default class PredictiveSelect extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.onClose = this.onClose.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.deselectOption = this.deselectOption.bind(this);
        this.setSelection = this.setSelection.bind(this);

        this.state = {
            searchText: ''
        }
    }

    onChange(option) {
        if(option.props.checked) {
            this.deselectOption(option.props.text);
        }
        else {
            this.selectOption(option.props.text);
        }
    }

    onSearch(text) {
        this.setState({
            searchText: text
        })
    }

    onClose() {
        this.setState({
            searchText: ''
        })
    }

    selectOption(value) {
        let newSelected = this.props.selected.slice();

        // Check not already selected
        if (this.props.selected.indexOf(value) < 0) {
            newSelected.push(value);
        }
        this.setSelection(newSelected);
    }

    deselectOption(value) {
        let newSelected = this.props.selected.slice();

        // Check selected
        const index = this.props.selected.indexOf(value);
        if (index >= 0) {
            newSelected.splice(index, 1);
        }

        this.setSelection(newSelected);
    }

    setSelection(selection) {
        if (this.props.setSelection !== undefined) {
            this.props.setSelection(selection);
        }
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
        let selected = [];

        if (this.props.selected && this.props.selected.length) {
            selected = this.props.selected.map(text =>
                <MenuOption
                    key={text}
                    text={text}
                    checked={true}
                />
            )
        }

        let options = [];
        if (this.state.searchText && this.state.searchText.length) {
            options = this.getSuggestions(this.state.searchText, this.props.selected);
        }
        else if (this.props.options && this.props.options.length) {
            options = this.props.options;
        }

        options = options.map(text =>
            <MenuOption
                key={text}
                text={text}
                checked={false}
            />
        )

        return (
            <Box>
                <Select
                    options={[...selected, ...options]}
                    valueLabel={this.props.label}
                    closeOnChange={false}
                    searchPlaceholder={this.props.placeholder}
                    onChange={option => this.onChange(option.value)}
                    onSearch={this.onSearch}
                    onClose={this.onClose}
                />
            </Box>
        );
    }
}