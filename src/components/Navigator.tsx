import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../views/Home/Index';
import SearchScreen from '../views/Search/Index';
import AdditionalScreen from '../views/Additional/Index';
import VideoScreen from '../views/Video/Index';
import DetailArtikel from '../views/articles/Details/Article/Index';
import DetailVideo from '../views/articles/Details/Video/Index';
import CategoryView from '../views/articles/Catetgories-view/Index';
import Signup from '../views/Auth/Register/Index';
import Signin from '../views/Auth/Login/Index';
import Dashboard from '../views/Dashboard/Main/Index';
import ListCategory from '../views/Dashboard/ListCategory/Index';
import ListArticles from '../views/Dashboard/ListArticles/Index';
import ListVideo from '../views/Dashboard/ListVideo/Index';
import Profile from '../views/Dashboard/Profile/Index';
import AddArticle from '../views/Dashboard/AddArticle/Index';
import AddCategory from '../views/Dashboard/AddCategory/Index';
import EditArticle from '../views/Dashboard/EditArticle/Index';
import EditVideo from '../views/Dashboard/EditVideo/Index';
import AddVideo from '../views/Dashboard/AddVideo/Index';
import CartCategory from '../views/ListCategoryHome/Index';

import BootSplash from 'react-native-bootsplash';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHome,
  faSearch,
  faBars,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Tab Navigator for the main screens
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = faHome;
          } else if (route.name === 'Search') {
            iconName = faSearch;
          } else if (route.name === 'Add') {
            iconName = faBars;
          } else if (route.name === 'Video') {
            iconName = faPlay;
          }

          return <FontAwesomeIcon icon={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#BC1D3A',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: 'black',
        },
      })}>
      <Tab.Screen name="Home" component={MainStack} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Video" component={VideoScreen} />
      <Tab.Screen name="Add" component={AdditionalScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator that includes the tab navigator and other screens
const MainStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Category"
        component={CategoryView}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="CartCategory"
        component={CartCategory}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

function Navigator() {
  return (
    <NavigationContainer onReady={() => BootSplash.hide({fade: true})}>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MyTabs}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={Signin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={Signup}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Details"
          component={DetailArtikel}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="VideoView"
          component={DetailVideo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Dashboard"
          component={Dashboard}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListArticles"
          component={ListArticles}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListCategory"
          component={ListCategory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ListVideo"
          component={ListVideo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddArticle"
          component={AddArticle}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddCategory"
          component={AddCategory}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddVideo"
          component={AddVideo}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditArticle"
          component={EditArticle}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="EditVideo"
          component={EditVideo}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
