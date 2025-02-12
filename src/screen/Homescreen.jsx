import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import bg from '../assets/images/bg.png';
import {theme} from '../theme/theme';
import {
  CalendarDaysIcon,
  MagnifyingGlassIcon,
} from 'react-native-heroicons/outline';
import {MapPinIcon} from 'react-native-heroicons/solid';
import wind from '../assets/images/wind.png';
import drop from '../assets/images/drop.png';
import suns from '../assets/images/suns.png';
import {fetchLocation, fetchWeatherForecast} from '../api/weatherApi';
import * as Progress from 'react-native-progress';
import {getData, storeData} from '../utils/asynStorage';

const {width, height} = Dimensions.get('window');
const circleRadius = Math.min(width, height) * 0.11;
const Homescreen = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [locations, setLocation] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = loc => {
    setLocation([]);
    setShowSearch(false);
    setLoading(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7',
    }).then(data => {
      setWeather(data);
      setLoading(false);
      storeData('city', loc.name);
    });
  };

  const handleSearch = value => {
    if (value.length > 2) {
      fetchLocation({cityName: value}).then(data => {
        setLocation(data);
      });
    }
  };

  useEffect(() => {
    fetMyWeatherdata();
  }, []);

  const fetMyWeatherdata = async () => {
    let myCity = await getData('city');
    let cityName = 'Lahore';
    if (myCity) cityName = myCity;
    fetchWeatherForecast({
      cityName,
      days: '7',
    }).then(data => {
      setWeather(data);
      setLoading(false);
    });
  };

  const {current, location} = weather;

  return (

        <View style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            // keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <StatusBar style="light" backgroundColor={'#0F3438'} />
              <Image source={bg} style={styles.image} blurRadius={70} />
              {loading ? (
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Progress.CircleSnail
                    thickness={15}
                    size={140}
                    color="#0bb3b2"
                  />
                </View>
              ) : (
                <SafeAreaView style={{flex: 1}}>
                  {/* Search Section */}
                  <View style={styles.searchContainer}>
                    <View
                      style={{
                        ...styles.innerContainer,
                        backgroundColor: showSearch
                          ? theme.bgWhite(0.2)
                          : 'transparent',
                      }}>
                      {showSearch ? (
                        <TextInput
                          onChangeText={handleSearch}
                          placeholder="Search city"
                          placeholderTextColor={'lightgray'}
                          style={styles.input}
                        />
                      ) : null}
                      <TouchableOpacity
                        style={{
                          ...styles.search,
                          backgroundColor: theme.bgWhite(0.3),
                        }}
                        onPress={() => {
                          setShowSearch(!showSearch);
                        }}>
                        <MagnifyingGlassIcon size={25} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{paddingHorizontal: 10}}>
                    {locations.length > 0 && showSearch ? (
                      <View style={styles.searchResult}>
                        {locations.map((loc, index) => {
                          return (
                            <TouchableOpacity
                              key={index}
                              style={[
                                styles.cardresult,
                                index === locations.length - 1
                                  ? {borderBottomWidth: 0}
                                  : '',
                              ]}
                              onPress={() => {
                                handleLocation(loc);
                              }}>
                              <MapPinIcon size={20} color="gray" />
                              <Text style={styles.heading}>
                                {loc?.name}, {loc.country}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    ) : null}
                  </View>

                  {/* forecast Section */}
                  <View style={styles.forecastContainer}>
                    {/* location */}
                    <Text style={styles.subHeading}>
                      {location?.name},
                      <Text
                        style={{
                          ...styles.subHeading,
                          fontSize: 18,
                          color: 'lightgray',
                        }}>
                        {' ' + location?.country}
                      </Text>
                    </Text>
                    {/* weather Image */}
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <Image
                        source={{uri: 'http:' + current?.condition?.icon}}
                        style={styles.clodImage}
                      />
                    </View>
                    {/* degree celcius */}
                    <View style={{marginVertical: 20}}>
                      <Text style={styles.celciustext}>
                        {current?.temp_c}&#176;
                      </Text>
                      <Text style={styles.celciusSubtext}>
                        {current?.condition?.text}
                      </Text>
                    </View>
                    {/* Other stats */}
                    <View style={styles.windContainer}>
                      <View style={styles.innerWind}>
                        <Image source={wind} style={styles.windImage} />
                        <Text style={styles.text}>{current?.wind_kph}km</Text>
                      </View>
                      <View style={styles.innerWind}>
                        <Image source={drop} style={styles.windImage} />
                        <Text style={styles.text}>{current.humidity}%</Text>
                      </View>
                      <View style={styles.innerWind}>
                        <Image source={suns} style={styles.windImage} />
                        <Text style={styles.text}>6:05AM</Text>
                      </View>
                    </View>
                  </View>

                  {/* Forecast Days */}
                  <View style={{marginBottom: 30}}>
                    <View style={styles.cardContainer}>
                      <CalendarDaysIcon size={22} color={'white'} />
                      <Text style={{color: 'white'}}>daily Forecast</Text>
                    </View>
                    <ScrollView
                      horizontal
                      contentContainerStyle={{paddingHorizontal: 15}}
                      showsHorizontalScrollIndicator={false}
                      >
                      {weather?.forecast?.forecastday?.map((item, index) => {
                        let date = new Date(item.date);
                        let options = {weekday: 'long'};
                        let dayName = date.toLocaleDateString('en-US', options);
                        return (
                          <View
                            key={index}
                            style={{
                              ...styles.cardrain,
                              backgroundColor: theme.bgWhite(0.15),
                            }}>
                            <Image
                              source={{
                                uri: 'http:' + item?.day?.condition?.icon,
                              }}
                              style={styles.rainImage}
                            />
                            <Text style={{color: 'white'}}>{dayName}</Text>
                            <Text style={styles.degree}>
                              {item?.day?.avgtemp_c}&#176;
                            </Text>
                          </View>
                        );
                      })}
                    
                    </ScrollView>
                  </View>
                </SafeAreaView>
              )}
            </View>
          </ScrollView>
        </View>
  
  );
};

export default Homescreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    position: 'absolute',
    width: width,
    height: height,
  },
  searchContainer: {
    height: '7%',
    marginHorizontal: 10,
    position: 'relative',
    zIndex: 50,
    marginVertical: 10,
  },
  innerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: circleRadius / 1,
  },
  input: {
    paddingLeft: 20,
    flex: 1,
    height: height - '8%',
    color: 'white',
    fontSize: 16,
  },
  search: {
    width: circleRadius,
    height: circleRadius,
    borderRadius: circleRadius / 2,
    padding: 5,
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResult: {
    borderRadius: circleRadius / 2,
    backgroundColor: 'lightgray',
    marginVertical: 5,
  },
  cardresult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  heading: {
    color: 'black',
    fontSize: 18,
    marginLeft: 5,
  },
  forecastContainer: {
    marginHorizontal: 10,
    flex: 1,
    marginBottom: 6,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  subHeading: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  clodImage: {
    width: 140,
    height: 140,
  },
  celciustext: {
    textAlign: 'center',
    fontSize: 52,
    fontWeight: 'bold',
    color: 'white',
  },
  celciusSubtext: {
    color: 'lightgray',
    textAlign: 'center',
    fontSize: 20,
  },
  windContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 40,
  },
  innerWind: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  windImage: {
    width: 20,
    height: 20,
  },
  text: {
    color: 'white',
    fontWeight: 'semibold',
  },
  cardrain: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 20,
    paddingVertical: 10,
    marginRight: 8,
    marginTop: 10,
  },
  rainImage: {
    height: 30,
    width: 30,
  },
  degree: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'semibold',
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});
