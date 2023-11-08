# Course Content Details

## Concepts

1. [Data Model](#data-model)
1. [Separation of Concerns](#separation-of-concerns)
1. [Single Responsibility Principle](#single-responsibility-principle)
1. [Database Client](#database-client)
1. [Entry Point](#entry-point)

### Upcomming

Not all but some of this things are concepts which will be introduced in future. This list is intended to grow.

1. Web Server
1. REST API
1. Routing
1. Frontend
1. Testing

## Data Model

_Blog article: [link](https://www.ibm.com/cloud/learn/data-modeling)._

_Detailed Wikipedia description: [link](https://en.wikipedia.org/wiki/Data_model)._

### Short Concept Description

In our application we use JavaScript classes to represent the data model. The data model is a core piece of our application around which the application is build. I think the first sentence in Wikipedia puts it quite well:

> A data model is an abstract model that organizes elements of data and standardizes how they relate to one another and to the properties of real-world entities. For instance, a data model may specify that the data element representing a car be composed of a number of other elements which, in turn, represent the color and size of the car and define its owner.

### In Our App

At the time of this writing: `game.js, players.js`.

## Separation of Concerns

_Blog article: [link](https://effectivesoftwaredesign.com/2012/02/05/separation-of-concerns/)._

_Detailed Wikipedia description: [link](https://en.wikipedia.org/wiki/Separation_of_concerns)._

### Short Concept Description

Devide a programm in sections where each section is responsible for one specific set of functionality that belongs together.

**Important: It's not a law. Do it if possible and break it if you must.**

### In Out App

One concern is database operations. Taken care by: `database.client.js`.

One concern is getting data from the steam api. Taken care by: `steam.data.processor.js`.

One concern is setup and orchestration of the parts of our application. Taken care by: `main.js`.

One concern is documentation. Taken care by: `README.md` which is this file.

## Single Responsibility Principle

_Blog article from the creator: [link](https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html)._

_Wikipedia article: [link](https://en.wikipedia.org/wiki/Single-responsibility_principle)._

### Short Concept Description

This one is related to the "Separation of Concerns". Every piece of a program e.g. class, module, function should focus on one concern.

Nice example from Wikipedia:

> As an example, consider a module that compiles and prints a report. Imagine such a module can be changed for two reasons. First, the content of the report could change. Second, the format of the report could change. These two things change for different causes. The single-responsibility principle says that these two aspects of the problem are really two separate responsibilities, and should, therefore, be in separate classes or modules. It would be a bad design to couple two things that change for different reasons at different times.

**Important: It's not a law. Do it if possible and break it if you must.**

### In Our App

The database client: `database.client.js`.

The entry point: `main.js`.

## Database Client

A class which encapsulates database operations and setup. So with that we follow the principles outlined above.

### In Our App

The database client: `database.client.js`.

## Entry Point

Onc central location in the application where all the pieces of the application are initialized and wired together. Can also be called `main`.

### In Our App

The database client: `main.js`.

## Things I've learned

### Best practice

Transform data into appropriate format as soon as you receive it.

### Application Layers

**Instantiation**: entry point code i.e. setup and configuration, instantiation of all other components and wiring them together

**Features**::Orchestration: feature related code which orchestrates infrastructure classes, model classes, its own services and if needed utils to implement feature logic

**Features**::Services: feature related code with uses model classes and utils to perform a feature related task without using any infrastructure

**Features**::API: routes, controllers and later also services which provide feature functionality which we are making available to the outside world (we use the web-server for that)...so far not much here except game-queries

**Infrastructure**: code which interfaces to everything external like databases, external APIs like steamAPI and code which creates an interface for other external things to interact with us like the web-server

**Utils**: reusable code which has no dependencies on any layer but is or can be used everywhere in the project

**Models**: representation of data goes here, instantiation also mutation/transformation and querying of this data goes here; models can depend on other models or utils but nothing more

### New Technologies

Always take some time to research some "best practices" when using a new technology, package, method, etc.
