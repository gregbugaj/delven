---
title: Welcome to Delven
type: index
weight: 0
---

Delven is a Domain Specific Language  (DSL) designed for mining content from static and dynamic sources, It closely resembles SQL with features borrowed from other popular  languages.

This documentation is your guide to an advanced new world of real-time data connectivity.

* To get an idea of what Delven is and how it can benefit your organization, visit the Introduction Section page.
* New users and experienced users alike may refer to the [Syntax](/syntax) section for all the information you need to create robust queries. 
* For new users, the [Tutorial](/examples ) provides an introduction to basic query writing skills and a page of sample queries to get you started.
* Programmers interested in embedding Delven within their application should visit the [API Reference](/api).

## Under the hood

This is a complete rewrite of original PhantomSQL data extract engine that was originally written in Java. Due to limitations of how far application could have been I decide to rewrite it completelly and take advantage of latest technology available.

Delven project consists of following

 * Parser / Transpiller
   * Transipills delven syntax into valid ECMAScript(JavaScript)
 * Runtime engine
   * Runtime that performs actuall extraction
 * UI Console
   * Console for managing and executing jobs


### Goals
Main issues that will be addressing with this rewrite are as follows

* Reworking language syntax
  * Based on modern languages / frameworks (EcmaScript / TypeScript / Python / Rubby / SQL/ Node.js)
  * Web 3.0 and beyound (Support for extracting data from dynamic websites as well as realtime data extraction)
* Exposing low level API as first class citizens
  * Javascript
  * TypeScript
  * C++ navive extensions  
* Query plan
* UI Execution Studio
* Package Manager
  * Node Package Manager(NPM)
* Distributed Processing
* Machine Learning