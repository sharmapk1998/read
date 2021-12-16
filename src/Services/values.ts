import firestore from '@react-native-firebase/firestore';
import {
  updateConstants,
  updateOrgConstants,
  updateProjects,
} from '../redux/actions';

export const fetchConstants = (dispatcher: any) => {
  const subscriber = firestore()
    .collection('values')
    .doc('constants')
    .onSnapshot((constants) => {
      if (constants) {
        const data = constants.data();
        if (data) {
          dispatcher(updateConstants(data));
        }
      }
    });
  return subscriber;
};

export const fetchCompanyResources = (
  organizationId: string,
  setCarousel: (data: string[]) => void,
  dispatcher: any,
) => {
  const subscriber = firestore()
    .collection('organizationResources')
    .doc(organizationId)
    .onSnapshot((carousel) => {
      if (carousel) {
        const data = carousel.data();
        if (data) {
          let carousel: string[] = [];
          let projects: string[] = [];
          let budgets: string[] = [];
          let locations: string[] = [];
          let sources: string[] = [];
          let resTypes: string[] = [];
          let comTypes: string[] = [];
          if (data.carousel) {
            data.carousel.forEach((item: any) => {
              carousel.push(item.url);
            });
            setCarousel(carousel);
          }
          if (data.projects) {
            dispatcher(updateProjects(data.projects));
            data.projects.forEach((item: any) => {
              projects.push(item.project_name);
            });
          }
          if (data.budgets) {
            data.budgets.forEach((item: any) => {
              budgets.push(item.budget);
            });
          }
          if (data.locations) {
            data.locations.forEach((item: any) => {
              locations.push(item.location_name);
            });
          }
          if (data.leadSources) {
            data.leadSources.forEach((item: any) => {
              sources.push(item.leadSource);
            });
          }
          if (data.resTypes) {
            resTypes = data.resTypes;
          }
          if (data.comTypes) {
            comTypes = data.comTypes;
          }
          dispatcher(
            updateOrgConstants({
              locations,
              budgets,
              projects,
              sources,
              permission: data.permission,
              comTypes,
              resTypes,
              transferReasons: data.TransferReasons ? data.TransferReasons : [],
            }),
          );
        } else {
          setCarousel([]);
        }
      }
    });
  return subscriber;
};
