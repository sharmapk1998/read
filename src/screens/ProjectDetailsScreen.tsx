import React, {FunctionComponent} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Snackbar from 'react-native-snackbar';

import Header from '../Components/Header';
import CustomCarousel from '../Components/HomeScreen/CustomCarousel';
import DocumentList from '../Components/KnowledgeCenter/DocumentList';
import Loader from '../Components/Modals/Loader';
import {fetchProject, openURL} from '../Services/resources';
import {widthToDp} from '../values/size';

type props = {
  navigation: any;
  route: any;
};

const ProjectDetailsScreen: FunctionComponent<props> = ({
  navigation,
  route,
}) => {
  const project = route.params.project;
  const [load, setLoad] = useState(false);

  const [projectData, setProjectData] = useState({
    brochures: [],
    forms: [],
    images: [],
    layouts: [],
    priceLists: [],
  });
  const [images, setImages] = useState<string[]>([]);
  useEffect(() => {
    setLoad(true);
    fetchProject(project.project_id, (data) => setProjectData(data)).then(
      () => {
        setLoad(false);
      },
    );
  }, []);

  useEffect(() => {
    let images: any[] = [];
    if (project.project_image && project.project_image !== '') {
      images = [project.project_image];
    }
    const data = {...projectData};
    if (data.images) {
      data.images.forEach((image: any) => images.push(image.link));
      setImages(images);
    } else {
      setImages([project.project_image]);
    }
  }, [projectData]);

  const onWalkthrough = () => {
    if (project.walkthrough_link && project.walkthrough_link !== '') {
      openURL(project.walkthrough_link);
    } else {
      Snackbar.show({
        text: 'No Walkthrough Exists!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };
  const onRERA = () => {
    if (project.rera_link && project.rera_link !== '') {
      openURL(project.rera_link);
    } else {
      Snackbar.show({
        text: 'RERA Link Not Exists!',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  const ImageView = (item: any) => {
    return (
      <Image
        source={{uri: item}}
        resizeMode={'cover'}
        style={{height: 210, width: '100%'}}
      />
    );
  };
  return (
    <>
      <Loader show={load} />
      <Header title={project.project_name} onBack={() => navigation.goBack()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{paddingBottom: 50}}
        showsVerticalScrollIndicator={false}>
        {images.length === 0 ? (
          <Image
            source={require('../../assets/no-image.jpg')}
            style={styles.image}
            resizeMode={'cover'}
          />
        ) : (
          <CustomCarousel
            carouselList={images}
            style={styles.carousel}
            ImageView={ImageView}
            itemWidth={widthToDp(100)}
          />
        )}

        <View style={styles.buttonView}>
          <TouchableOpacity style={styles.button} onPress={onRERA}>
            <Text style={styles.buttonText}>RERA Verification</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onWalkthrough}>
            <Text style={styles.buttonText}>Walkthrough</Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingLeft: '5%', marginTop: 15}}>
          <DocumentList
            tittle={'BROCHURES'}
            project_name={project.project_name}
            dataList={projectData.brochures}
          />
          <DocumentList
            tittle={'PRICELIST'}
            project_name={project.project_name}
            dataList={projectData.priceLists}
          />
          <DocumentList
            tittle={'LAYOUTS'}
            project_name={project.project_name}
            dataList={projectData.layouts}
          />
          <DocumentList
            tittle={'FORMS'}
            project_name={project.project_name}
            dataList={projectData.forms}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    width: '100%',
  },
  image: {
    height: 200,
    width: '100%',
  },
  carousel: {
    height: 230,
    width: '100%',
  },
  buttonView: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: -65,
  },
  button: {
    width: '49.5%',
    backgroundColor: '#00000090',
    alignItems: 'center',
    justifyContent: 'center',
    height: 45,
  },
  buttonText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default ProjectDetailsScreen;
