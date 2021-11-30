# Specification families for /TR

This repository was created to manage the list of specification families that will be used on /TR.
[`families.json`](https://github.com/w3c/spec-families/blob/main/families.json) is the JSON listing all the families. Each family is composed of two elements:
* the `name` of the family
* the list of specification series shortnames belonging to that family

## Constraints

The following list of constraints on `families.json` are being checked by a GitHub action after each change:
* each family has a unique name
* a series belongs to one and only one family
* all the series listed on /TR must be specified in the JSON and vice versa
