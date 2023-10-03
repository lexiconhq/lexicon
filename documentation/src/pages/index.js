import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function Home() {
  const [redirectPath, setRedirectPath] = useState(null);
  const { i18n } = useDocusaurusContext();

  useEffect(() => {
    const selectedLanguage = i18n.currentLocale;
    let versionToRedirect;

    switch (selectedLanguage) {
      case 'en':
        versionToRedirect = '';
        break;
      default:
        versionToRedirect = selectedLanguage;
        break;
    }

    setRedirectPath(
      `${versionToRedirect ? '/' + versionToRedirect : ''}/version-2.0.0-beta/`,
    );
  }, [i18n.currentLocale]);

  if (redirectPath) {
    return <Redirect to={redirectPath} />;
  }

  return null;
}
