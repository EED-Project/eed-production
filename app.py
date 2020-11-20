import os

from backend import create_app

homepage_folder_path = os.path.join(
    os.path.dirname(os.path.realpath(__file__)), 'frontend')


app = create_app(static_folder=homepage_folder_path, template_folder=homepage_folder_path, static_url_path='')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port)