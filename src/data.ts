export class DataPoint {
  name: string;
  value: string;
  description?: string;
}

export const imageDirectory = {
  "House Need": "public/images/axis-icons/sdg-11.1.1.png",
  Transit: "public/images/axis-icons/sdg-11.2.1.png",
  Consumption: "public/images/axis-icons/sdg-11.3.1.png",
  Civility: "public/images/axis-icons/sdg-11.3.2.png",
  Affected: "public/images/axis-icons/sdg-11.5.1.1.png",
  Disaster: "public/images/axis-icons/sdg-11.5.1.2.png",
  "Econ Loss1": "public/images/axis-icons/sdg-11.5.2.png",
  "Econ Loss2": "public/images/axis-icons/sdg-11.5.2.png",
  Waste: "public/images/axis-icons/sdg-11.6.1.png",
  PM: "public/images/axis-icons/sdg-11.6.2.png",
  // TODO: Add 11.7.1
  Assult: "public/images/axis-icons/sdg-11.7.2.png",
};

export class DataModel {
  name: string;
  data: DataPoint[];
}

export class Data {
  /** Return the max value of all DataModel.DataPoint.values */
  static getAbsoluteMax(data: DataModel[]): number {
    const nonFlatArrOfNumbers = data.map((d) =>
      d.data.map((x) => Number(x.value))
    );
    return Math.max(...this.flat(nonFlatArrOfNumbers));
  }

  private static flat(nestedArray: number[][]): number[] {
    return [].concat.apply([], nestedArray);
  }

  /** Given a DataModel[], get the max value of every common data.name variable */
  static getMaxPerVariable(data: DataModel[]): number[] {
    return this.runOperationOnGroupOfVariables(data, Math.max);
  }

  /** Given a DataModel[], get the min value of every common data.name variable */
  static getMinPerVariable(data: DataModel[]): number[] {
    return this.runOperationOnGroupOfVariables(data, Math.min);
  }

  private static runOperationOnGroupOfVariables(data: DataModel[], operation) {
    const numberMatrix = data.map((d) => d.data.map((x) => Number(x.value)));
    let maxOfVariable: number[] = [];
    for (let i in numberMatrix[0]) {
      let groupValuesByVariable = numberMatrix.map((d) => d[i]);
      maxOfVariable.push(operation(...groupValuesByVariable));
    }
    return maxOfVariable;
  }

  /**
   * \brief   Averages the city data.
   * @param   cityData : The array of DataPoint describing the city.
   * @returns Returns the average of the city's DataPoint values.
   */
   static getMeanCityData(cityData: DataPoint[]): number {
    if (cityData.length <= 0) {
      return 0;
    }

    let sum = 0.0;
    let numElements = 0;
    cityData.forEach((d) => addDataPointElement(d.value));
    function addDataPointElement(dataPointValue: string) {
      sum += parseFloat(dataPointValue);
      ++numElements;
    }
    let avg = sum / numElements;
    return avg;
  }


   /**
   * @brief   Renders the left-side plot with city averages, sorted descending.
   * @param   avgBarplot : The barPlot to render.
   * @returns N/A
   */
  static getMeanCountry() : DataPoint[] {
    let countryData = Data.getSyncData();
    let meanCountryData : DataPoint[] = [];
    countryData.forEach((d) => addMeanCity(d));

    function addMeanCity(cityData : DataModel) {
      let citySummary: DataPoint = {
        name:         cityData.name,
        description:  cityData.name,
        value:        Data.getMeanCityData(cityData.data).toString()
      };
      meanCountryData.push(citySummary);
    }

    meanCountryData.sort(Data.compareDataPoint);
    return meanCountryData;
  }

  /**
   * @brief   Compares the values of two DataPoints. Useful for sorting funtions.
   * @param   a : The first DataPoint to compare.
   * @param   b : The second DataPoint to compare.
   * @returns Returns:
   *            - -1 if a < b
   *            - +1 if a > b
   *            - 0 if a == b
   */
  static compareDataPoint( a: DataPoint, b: DataPoint) : number {
    if ( a.value < b.value ){
      return -1;
    }
    else if ( a.value > b.value ){
      return 1;
    }
    return 0;
  }
  /**
   * @returns   Returns all geographic data as an array of Data Model.
   * \details   Each DataModel element pertains to one city, and has a name and data property.
   *              - The data property is an array of DataPoint
   *              - Each DataPoint has three strings (name, desc, value) for the bar plot.
   */
  static getSyncData(): DataModel[] {
    return [
      {
        name: "St. John's",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.196",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.549820379",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.3375",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99885",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.967883133",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.735821209",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.980259785",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.978409898",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.401",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Halifax",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.2",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.536434783",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99863",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.758780432",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.001327723",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.991863667",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.991563022",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.291",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Quebec City",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.072",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.655235282",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.4288",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99928",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.849684887",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.67901811",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.992612202",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.992181355",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.169",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.65",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Sherbrooke",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.2",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.387392585",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.2546",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99928",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.946702839",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.568067252",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.998054561",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.997941172",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.236",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.4",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Montreal",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.116",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.645690609",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.3645",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99891",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.199575696",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.667936388",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.962036346",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.959823367",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.084",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.65",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Toronto",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.12",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.979448204",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.4039",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99809",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.035948184",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.724516178",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.472314916",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.447432205",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.07",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.85",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Hamilton",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.088",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.688080807",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.153",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.9987",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.914932794",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.810179056",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.992682509",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.992337456",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.189",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.95",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "St. Catharines, Niagara",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.124",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.227583306",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.2423",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99861",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.954073194",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.811449338",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.99605296",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.995866839",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.191",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.7",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Kitchener, Cambridge, Waterloo",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.108",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.938148814",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.1522",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99886",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.940800328",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.809236346",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.99492853",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.994689387",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.138",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.8",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "London",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.128",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.726802178",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.1831",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99861",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.944031391",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.810670649",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.995194437",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.994967834",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.223",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.8",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Windsor",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.068",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.257336486",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.3367",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99883",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.952197311",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.760449643",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.996747006",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.996593613",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.329",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.65",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Winnipeg",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.168",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.731442514",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.0082",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99879",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.98678976",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.970952269",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.617834473",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.605963669",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.118",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.8",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Regina",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.076",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.69016505",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.1563",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99867",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.993824603",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.954289297",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.975137073",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.972506065",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.096",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.45",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Saskatoon",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.128",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.789715092",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99882",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.999728535",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.998381243",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.966749603",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.963441872",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.174",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.75",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Calgary",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.192",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "1.029322572",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.2922",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99887",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.969706496",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.961480235",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.204076288",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.146420409",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.111",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.8",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Edmonton",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.144",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.878202354",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.1443",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.80",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.999265422",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.999016644",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.995613356",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.80",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.173",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.65",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "0.80",
          },
        ],
      },
      {
        name: "Vancouver",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.22",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "1.01814951",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.4772",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99824",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.464536408",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.631343497",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.839610176",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.829440932",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.073",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.8",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
      {
        name: "Victoria",
        data: [
          {
            name: "PM",
            description:
              "Average fine particule matter concentrations (PM 2.5)",
            value: "1.228",
          },
          {
            name: "Consumption",
            description:
              "Ratio of land consumption rate to population growth rate (1971 to 2011)",
            value: "0.945180333",
          },
          {
            name: "Assult",
            description: "Sexual assault (rate per 100,000 population)",
            value: "0.2873",
          },
          {
            name: "House Need",
            description: "Proportion of households in core housing need",
            value: "0.99858",
          },
          {
            name: "Affected",
            description: "Total Affected",
            value: "0.967908252",
          },
          {
            name: "Disaster",
            description:
              "Number of people who died, went missing or were directly affected by disasters per 100,000 population.",
            value: "0.851876173",
          },
          {
            name: "Econ Loss1",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Canadian Disaster Database)",
            value: "0.987398785",
          },
          {
            name: "Econ Loss2",
            description:
              "Direct economic loss: the monetary value of total or partial destruction of physical assets existing in the affected area. Direct economic loss is nearly equivalent to physical damage (based on the Inflation Calculator)",
            value: "0.987105407",
          },
          {
            name: "Transit",
            description:
              "Percentage of population less than 500 metres from public transit access point. ",
            value: "0.096",
          },
          {
            name: "Civility",
            description:
              "Proportion of cities with a direct participation structure of civil society in urban planning and management that operate regularly and democratically ",
            value: "0.8",
          },
          {
            name: "Waste",
            description:
              "Proportion of urban solid waste regularly collected and with adequate final discharge out of total urban solid waste generated by cities ",
            value: "1.0",
          },
        ],
      },
    ];
  }
}
